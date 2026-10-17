import { Container } from 'pixi.js'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

export class TileLayer extends Container {
	setLevel(level: LevelInstance) {
		this.removeChildren()
		for(const tile of level.tiles) {

		}
	}
}
