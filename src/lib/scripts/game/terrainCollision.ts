import type { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XYMap } from '#lib/scripts/utils/XYMap.ts'
import { Consts } from '#lib/scripts/consts.ts'

const FEET_EXTRA = 0.3
const EPSILON = 0.001

type Body = {
	x: number
	y: number
	width: number
	height: number
}

export class TerrainCollision {
	constructor(private tiles: XYMap<TileDef>) {}
	isGrounded(body: Body) {
		return this.overlapsSolid({
			...body,
			y: body.y + FEET_EXTRA,
			height: body.height,
		})
	}

	private overlapsSolid(body: Body): boolean {
		const left = body.x - body.width / 2
		const right = body.x + body.width / 2
		const top = body.y - body.height / 2
		const bottom = body.y + body.height / 2
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
