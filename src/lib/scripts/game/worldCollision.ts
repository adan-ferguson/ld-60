import { Consts } from '#lib/scripts/consts.ts'
import type { TileContents } from '#lib/scripts/game/levelDef.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'

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

export class WorldCollision {
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
		const feet = new CoolRect({
			x: rect.x,
			y: rect.bottom,
			width: rect.width,
			height: FEET_CHECK_HEIGHT,
		})
		return this.solids.some((solid) => feet.intersects(solid.rect))
	}

	overlapsLava(rect: CoolRect): boolean {
		return this.overlapsTileKind(rect, 'lava')
	}

	resolveMovement(rect: CoolRect, deltaX: number, deltaY: number): MovementResult {
		const horizontal = this.resolveAxis(rect, 'x', deltaX)

		const movedRect = rect.shift({
			x: horizontal.position - rect.x,
			y: 0,
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
		const currentPosition = rect[axis]
		const nextPosition = currentPosition + delta

		const size = axis === 'x' ? rect.width : rect.height
		const perpendicularStart = axis === 'x' ? rect.y : rect.x
		const perpendicularEnd = axis === 'x' ? rect.bottom : rect.right

		const currentLeadingEdge = delta > 0 ? currentPosition + size : currentPosition
		const nextLeadingEdge = delta > 0 ? nextPosition + size : nextPosition

		let bestPosition = nextPosition
		let bestTravel = Math.abs(delta)
		let collided = false

		for (const solid of this.solids) {
			const obstacle = solid.rect

			const obstaclePerpendicularStart = axis === 'x' ? obstacle.y : obstacle.x

			const obstaclePerpendicularEnd = axis === 'x' ? obstacle.bottom : obstacle.right

			// The body and obstacle need positive overlap on the
			// perpendicular axis for this to be a collision.
			const overlapsPerpendicular =
				perpendicularStart < obstaclePerpendicularEnd &&
				perpendicularEnd > obstaclePerpendicularStart

			if (!overlapsPerpendicular) {
				continue
			}

			const obstacleLeadingEdge =
				delta > 0
					? axis === 'x'
						? obstacle.x
						: obstacle.y
					: axis === 'x'
						? obstacle.right
						: obstacle.bottom

			const crossedObstacle =
				delta > 0
					? currentLeadingEdge <= obstacleLeadingEdge && nextLeadingEdge >= obstacleLeadingEdge
					: currentLeadingEdge >= obstacleLeadingEdge && nextLeadingEdge <= obstacleLeadingEdge

			if (!crossedObstacle) {
				continue
			}

			const collisionDistance = obstacleLeadingEdge - currentLeadingEdge
			const collisionPosition = currentPosition + collisionDistance
			const travel = Math.abs(collisionDistance)

			if (travel > bestTravel) {
				continue
			}

			bestTravel = travel
			bestPosition = collisionPosition
			collided = true
		}

		return {
			position: bestPosition,
			collided,
		}
	}

	overlapsSolid(rect: CoolRect): boolean {
		return this.solids.some((solid) => rect.intersects(solid.rect, true))
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

	private overlapsTileKind(rect: CoolRect, tileType: TileContents['kind']): boolean {
		const { TILE_SIZE_PX } = Consts

		const minTileX = Math.floor(rect.left / TILE_SIZE_PX)
		const maxTileX = Math.floor((rect.right - 0.001) / TILE_SIZE_PX)
		const minTileY = Math.floor(rect.top / TILE_SIZE_PX)
		const maxTileY = Math.floor((rect.bottom - 0.001) / TILE_SIZE_PX)

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
