import { Container, Graphics, Rectangle } from 'pixi.js'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Consts } from '#lib/scripts/consts.ts'

export class TerrainLayer extends Container {
	setLevel(level: LevelInstance) {
		const { TILE_SIZE } = Consts
		this.removeChildren()
		for (const tile of level.tiles.values) {
			if (tile.type == 'wall') {
				const rect = new Rectangle(
					tile.XY.x * TILE_SIZE,
					tile.XY.y * TILE_SIZE,
					TILE_SIZE,
					TILE_SIZE,
				)
				// Draw a tile here from some png
			}
		}
	}
}
