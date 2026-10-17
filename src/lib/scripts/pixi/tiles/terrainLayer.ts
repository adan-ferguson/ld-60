import { Graphics, Rectangle } from 'pixi.js'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Consts } from '#lib/scripts/consts.ts'

export class TerrainLayer extends Graphics {
	setLevel(level: LevelInstance) {
		const { TILE_SIZE } = Consts
		this.clear()
		for (const tile of level.tiles.values) {
			if (tile.type == 'wall') {
				this.rect(tile.XY.x * TILE_SIZE, tile.XY.y * TILE_SIZE, TILE_SIZE, TILE_SIZE).fill('white')
			}
		}
	}
}
