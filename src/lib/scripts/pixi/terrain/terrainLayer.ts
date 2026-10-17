import { Graphics } from 'pixi.js'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Consts } from '#lib/scripts/consts.ts'

export class TerrainLayer extends Graphics {
	setLevel(level: LevelInstance) {
		const { TILE_SIZE_PX } = Consts
		this.clear()
		for (const tile of level.tiles.values) {
			if (tile.type == 'wall') {
				this.rect(
					tile.XY.x * TILE_SIZE_PX,
					tile.XY.y * TILE_SIZE_PX,
					TILE_SIZE_PX,
					TILE_SIZE_PX,
				).fill('white')
			}
		}
	}
}
