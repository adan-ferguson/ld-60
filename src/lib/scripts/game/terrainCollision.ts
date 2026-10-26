import { Consts } from '#lib/scripts/consts.ts'
import type { TileContents } from '#lib/scripts/game/levelDef.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'

const EPSILON = 0.001

type Solid = {
	rect: CoolRect
	velocityX: number
	velocityY: number
}

type PushCandidate = {
	x: number
	y: number
	depth: number
	preferred: boolean
}

type Axis = 'x' | 'y'

type AxisCollisionResult = {
	position: number
	collided: boolean
}

type MovementResult = {
	x: number
	y: number
	hitHorizontal: boolean
	hitVertical: boolean
}

const FEET_CHECK_HEIGHT = 0.5

export class TerrainCollision {
	constructor(private game: Game) {}
	private get solids(): Solid[] {
		return [
			...this.tiles.values
				.filter((t) => t.contents.kind === 'wall')
				.map((t) => ({
					rect: new CoolRect(TileDef.toWorldRect(t.tileXY)),
					velocityX: 0,
					velocityY: 0,
				})),
			...this.game.entitiesManager.entities
				.values()
				.filter((t) => t.isSolid)
				.map((t) => ({
					rect: new CoolRect(t.worldBounds),
					velocityX: t.velX,
					velocityY: t.velY,
				})),
		]
	}
	get tiles() {
		return this.game.level.tiles
	}
	isGrounded(rect: CoolRect) {
		return this.overlapsSolid(
			new CoolRect({
				...rect,
				y: rect.y + rect.height,
				height: FEET_CHECK_HEIGHT,
			}),
		)
	}

	overlapsLava(rect: CoolRect): boolean {
		return this.overlapsTileKind(rect, 'lava')
	}

	resolveMovement(rect: CoolRect, deltaX: number, deltaY: number): MovementResult {
		const horizontal = this.resolveAxis(rect, 'x', deltaX)

		const movedRect = new CoolRect({
			...rect,
			x: horizontal.position,
		})

		const vertical = this.resolveAxis(movedRect, 'y', deltaY)

		return {
			x: horizontal.position,
			y: vertical.position,
			hitHorizontal: horizontal.collided,
			hitVertical: vertical.collided,
		}
	}

	private resolveAxis(rect: CoolRect, axis: Axis, delta: number): AxisCollisionResult {
		if (delta === 0) {
			return {
				position: rect[axis],
				collided: false,
			}
		}

		const tileSize = Consts.TILE_SIZE_PX
		const currentPosition = rect[axis]
		const nextPosition = currentPosition + delta
		const size = axis === 'x' ? rect.width : rect.height
		const perpendicularStart = axis === 'x' ? rect.y : rect.x
		const perpendicularSize = axis === 'x' ? rect.height : rect.width
		const minPerpendicularTile = Math.floor((perpendicularStart + EPSILON) / tileSize)

		const maxPerpendicularTile = Math.floor(
			(perpendicularStart + perpendicularSize - EPSILON) / tileSize,
		)

		const currentLeadingEdge = delta > 0 ? currentPosition + size : currentPosition
		const nextLeadingEdge = delta > 0 ? nextPosition + size : nextPosition

		const minLeadingTile = Math.floor(
			(Math.min(currentLeadingEdge, nextLeadingEdge) + EPSILON) / tileSize,
		)

		const maxLeadingTile = Math.floor(
			(Math.max(currentLeadingEdge, nextLeadingEdge) - EPSILON) / tileSize,
		)

		const firstTile = delta > 0 ? minLeadingTile : maxLeadingTile
		const lastTile = delta > 0 ? maxLeadingTile : minLeadingTile
		const step = delta > 0 ? 1 : -1

		for (
			let leadingTile = firstTile;
			delta > 0 ? leadingTile <= lastTile : leadingTile >= lastTile;
			leadingTile += step
		) {
			for (
				let perpendicularTile = minPerpendicularTile;
				perpendicularTile <= maxPerpendicularTile;
				perpendicularTile++
			) {
				const tileX = axis === 'x' ? leadingTile : perpendicularTile

				const tileY = axis === 'x' ? perpendicularTile : leadingTile

				if (!this.isSolidTile(tileX, tileY)) {
					continue
				}

				const tileStart = leadingTile * tileSize
				const tileEnd = tileStart + tileSize

				const resolvedPosition = delta > 0 ? tileStart - size : tileEnd

				return {
					position: resolvedPosition,
					collided: true,
				}
			}
		}

		return {
			position: nextPosition,
			collided: false,
		}
	}

	public overlapsSolid(rect: CoolRect): boolean {
		return this.overlapsTileKind(rect, 'wall')
	}

	private overlapsTileKind(rect: CoolRect, tileType: TileContents['kind']): boolean {
		const left = rect.x
		const right = rect.x + rect.width
		const top = rect.y
		const bottom = rect.y + rect.height
		const { TILE_SIZE_PX } = Consts

		const minTileX = Math.floor((left + EPSILON) / TILE_SIZE_PX)
		const maxTileX = Math.floor((right - EPSILON) / TILE_SIZE_PX)
		const minTileY = Math.floor((top + EPSILON) / TILE_SIZE_PX)
		const maxTileY = Math.floor((bottom - EPSILON) / TILE_SIZE_PX)

		for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
			for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
				const tile = this.tiles.get({ x: tileX, y: tileY })

				if (tile?.contents.kind === tileType) {
					return true
				}
			}
		}

		return false
	}

	private isSolidTile(x: number, y: number): boolean {
		return this.tiles.get({ x, y })?.contents.kind === 'wall'
	}

	pushOutOfSolids(entity: GameEntity) {
		const MAX_PUSHES = 4
		for (let i = 0; i < MAX_PUSHES; i++) {
			const rect = entity.worldBounds
			const overlaps = this.solids
				.filter((solid) => rect.intersects(solid.rect, true))
				.map((solid) => this.getPushCandidates(entity, solid))
			if (overlaps.length === 0) {
				return
			}
			const correction = overlaps.flat().sort((a, b) => a.depth - b.depth)[0]
			if (!correction) {
				return
			}
			entity.x += correction.x
			entity.y += correction.y
		}
	}

	private getPushCandidates(entity: GameEntity, solid: Solid): PushCandidate[] {
		const body = entity.worldBounds
		const obstacle = solid.rect

		const overlapLeft = body.right - obstacle.x
		const overlapRight = obstacle.right - body.x
		const overlapUp = body.bottom - obstacle.y
		const overlapDown = obstacle.bottom - body.y

		const relativeVelocityX = entity.velX - solid.velocityX
		const relativeVelocityY = entity.velY - solid.velocityY

		const candidates: PushCandidate[] = [
			{
				x: -overlapLeft,
				y: 0,
				depth: overlapLeft,
				preferred: relativeVelocityX > 0,
			},
			{
				x: overlapRight,
				y: 0,
				depth: overlapRight,
				preferred: relativeVelocityX < 0,
			},
			{
				x: 0,
				y: -overlapUp,
				depth: overlapUp,
				preferred: relativeVelocityY > 0,
			},
			{
				x: 0,
				y: overlapDown,
				depth: overlapDown,
				preferred: relativeVelocityY < 0,
			},
		]

		const preferred = candidates.filter((candidate) => candidate.preferred)
		return preferred.length > 0 ? preferred : candidates
	}
}
