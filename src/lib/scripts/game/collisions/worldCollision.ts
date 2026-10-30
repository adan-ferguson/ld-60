import { Consts } from '#lib/scripts/consts.ts'
import type { TileContents } from '#lib/scripts/game/levelDef.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import { Cardinal } from '#lib/scripts/utils/cardinal.ts'
import { XY } from '#lib/scripts/utils/XY.ts'

type MovementBlocker = {
	entity?: GameEntity
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

export class WorldCollision {
	constructor(private game: Game) {}
	get movementBlockers(): MovementBlocker[] {
		return [
			...this.tilesOfType('wall').map((t) => ({
				rect: new CoolRect(TileDef.toWorldRect(t.tileXY)),
				velocityX: 0,
				velocityY: 0,
			})),
			...this.game.entitiesManager.activeEntities
				.filter((t) => t.blocksMovement)
				.map((t) => ({
					entity: t,
					rect: new CoolRect(t.worldBounds),
					velocityX: t.velX,
					velocityY: t.velY,
				})),
		]
	}

	get projectileBlockers(): CoolRect[] {
		return [
			...this.tilesOfType('wall').map((t) => TileDef.toWorldRect(t.tileXY)),
			...this.game.entitiesManager.activeEntities
				.filter((t) => t.blocksProjectiles)
				.map((t) => t.worldBounds),
		]
	}

	get hazards(): CoolRect[] {
		return [
			...this.tilesOfType('lava', 'spikes').map((t) =>
				TileDef.toWorldRect(t.tileXY).getEdge('bottom', 0.35),
			),
			...this.game.entitiesManager.activeEntities
				.filter((t) => t.isHazard)
				.map((t) => t.worldBounds),
		]
	}

	get tiles() {
		return this.game.level.tiles
	}

	getGround(entityRect: CoolRect) {
		const feetRect = entityRect.getEdge('bottom').pad({ y: 0.001 })
		return this.movementBlockers.filter((solid) => feetRect.intersects(solid.rect.getEdge('top')))
	}

	isGrounded(entityRect: CoolRect): boolean {
		const feetRect = entityRect.getEdge('bottom').pad({ y: 0.001 })
		return this.movementBlockers.some((solid) => feetRect.intersects(solid.rect.getEdge('top')))
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

	overlapsWall(myWallCollisionBounds: CoolRect) {
		return (
			this.overlapsTileKind(myWallCollisionBounds, 'wall') ||
			this.overlapsTileKind(myWallCollisionBounds, 'movingBlock')
		)
	}

	overlapsSolid(rect: CoolRect, exclude?: GameEntity): boolean {
		return this.movementBlockers.some((solid) => {
			if (exclude !== undefined && solid.entity === exclude) {
				return false
			}
			return rect.intersects(solid.rect, true)
		})
	}

	pushOutOfSolids(entity: GameEntity) {
		const MAX_PUSHES = 4
		for (let i = 0; i < MAX_PUSHES; i++) {
			const rect = entity.worldBounds
			const overlaps = this.movementBlockers
				.filter((solid) => rect.intersects(solid.rect, true))
				.flatMap((solid) => this.getPushCandidates(entity, solid))
			if (overlaps.length === 0) {
				return
			}
			const correction = overlaps.sort((a, b) => {
				if (a.depth !== b.depth) {
					return a.depth - b.depth
				}
				if (a.preferred !== b.preferred) {
					return a.preferred ? -1 : 1
				}
				return 0
			})[0]
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
		const maxTileX = Math.floor((rect.right - 0.01) / TILE_SIZE_PX)
		const minTileY = Math.floor(rect.top / TILE_SIZE_PX)
		const maxTileY = Math.floor((rect.bottom - 0.01) / TILE_SIZE_PX)

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

	private getPushCandidates(entity: GameEntity, solid: MovementBlocker): PushCandidate[] {
		const body = entity.worldBounds
		const obstacle = solid.rect

		const penetrationX = Math.min(body.right - obstacle.left, obstacle.right - body.left)

		const penetrationY = Math.min(body.bottom - obstacle.top, obstacle.bottom - body.top)

		if (penetrationX <= 0 || penetrationY <= 0) {
			return []
		}

		const relativeVelocityX = entity.velX - solid.velocityX
		const relativeVelocityY = entity.velY - solid.velocityY

		const bodyCenterX = body.left + body.width / 2
		const obstacleCenterX = obstacle.left + obstacle.width / 2
		const bodyCenterY = body.top + body.height / 2
		const obstacleCenterY = obstacle.top + obstacle.height / 2

		const pushLeft = bodyCenterX < obstacleCenterX
		const pushUp = bodyCenterY < obstacleCenterY

		return [
			{
				x: pushLeft ? -penetrationX : penetrationX,
				y: 0,
				depth: penetrationX,
				preferred: pushLeft ? relativeVelocityX > 0 : relativeVelocityX < 0,
			},
			{
				x: 0,
				y: pushUp ? -penetrationY : penetrationY,
				depth: penetrationY,
				preferred: pushUp ? relativeVelocityY > 0 : relativeVelocityY < 0,
			},
		]
	}

	private overlapsOnAdjacentAxis(rect: CoolRect, solid: CoolRect, cardinal: Cardinal): boolean {
		return (
			rect[cardinal.adjacentEdgeLower] < solid[cardinal.adjacentEdgeUpper] - 0.001 &&
			rect[cardinal.adjacentEdgeUpper] > solid[cardinal.adjacentEdgeLower] + 0.001
		)
	}

	private leadingEdgeOffset(rect: CoolRect, edge: 'top' | 'bottom' | 'left' | 'right'): number {
		switch (edge) {
			case 'top':
			case 'left':
				return 0
			case 'bottom':
				return rect.height
			case 'right':
				return rect.width
		}
	}

	private resolveAxis(rect: CoolRect, axis: Axis, delta: number): AxisCollisionResult {
		if (delta === 0) {
			return {
				position: rect[axis],
				collided: false,
			}
		}

		const cardinal = Cardinal.fromAxisDelta(axis === 'x', delta > 0)
		const edge = cardinal.edge

		const leadingEdge = rect[edge]
		const nextRect = rect.shift(XY.scale(cardinal.xy, Math.abs(delta)))
		const nextLeadingEdge = nextRect[edge]

		let bestDistance = Math.abs(delta)
		let bestPosition = nextRect[axis]
		let collided = false

		for (const solid of this.movementBlockers) {
			if (!this.overlapsOnAdjacentAxis(rect, solid.rect, cardinal)) {
				continue
			}

			const obstacleEdge = solid.rect[cardinal.oppositeEdge]

			const crossed =
				cardinal.sign < 0
					? leadingEdge >= obstacleEdge && nextLeadingEdge <= obstacleEdge
					: leadingEdge <= obstacleEdge && nextLeadingEdge >= obstacleEdge

			if (!crossed) {
				continue
			}

			const distance = Math.abs(obstacleEdge - leadingEdge)

			if (distance > bestDistance) {
				continue
			}

			bestDistance = distance
			bestPosition = obstacleEdge - this.leadingEdgeOffset(rect, cardinal.edge)
			collided = true
		}

		return {
			position: bestPosition,
			collided,
		}
	}

	private tilesOfType(...type: TileContents['kind'][]): TileDef[] {
		return this.tiles.values.filter((t) => type.includes(t.contents.kind))
	}
}
