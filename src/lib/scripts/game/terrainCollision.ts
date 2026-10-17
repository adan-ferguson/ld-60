import type { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XYMap } from '#lib/scripts/utils/XYMap.ts'
import { Consts } from '#lib/scripts/consts.ts'

const EPSILON = 0.001

type Body = {
	x: number
	y: number
	width: number
	height: number
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
	constructor(private tiles: XYMap<TileDef>) {}
	isGrounded(body: Body) {
		return this.overlapsSolid({
			...body,
			y: body.y + body.height,
			height: FEET_CHECK_HEIGHT,
		})
	}

	resolveMovement(body: Body, deltaX: number, deltaY: number): MovementResult {
		const horizontal = this.resolveAxis(body, 'x', deltaX)

		const movedBody: Body = {
			...body,
			x: horizontal.position,
		}

		const vertical = this.resolveAxis(movedBody, 'y', deltaY)

		return {
			x: horizontal.position,
			y: vertical.position,
			hitHorizontal: horizontal.collided,
			hitVertical: vertical.collided,
		}
	}

	private resolveAxis(body: Body, axis: Axis, delta: number): AxisCollisionResult {
		if (delta === 0) {
			return {
				position: body[axis],
				collided: false,
			}
		}

		const tileSize = Consts.TILE_SIZE_PX
		const currentPosition = body[axis]
		const nextPosition = currentPosition + delta
		const size = axis === 'x' ? body.width : body.height
		const perpendicularStart = axis === 'x' ? body.y : body.x
		const perpendicularSize = axis === 'x' ? body.height : body.width
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

	private overlapsSolid(body: Body): boolean {
		const left = body.x
		const right = body.x + body.width
		const top = body.y
		const bottom = body.y + body.height
		const { TILE_SIZE_PX } = Consts

		const minTileX = Math.floor((left + EPSILON) / TILE_SIZE_PX)
		const maxTileX = Math.floor((right - EPSILON) / TILE_SIZE_PX)
		const minTileY = Math.floor((top + EPSILON) / TILE_SIZE_PX)
		const maxTileY = Math.floor((bottom - EPSILON) / TILE_SIZE_PX)

		for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
			for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
				if (this.isSolidTile(tileX, tileY)) {
					return true
				}
			}
		}

		return false
	}

	private isSolidTile(x: number, y: number): boolean {
		return this.tiles.get({ x, y })?.type === 'wall'
	}
}
