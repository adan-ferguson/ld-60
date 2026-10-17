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
