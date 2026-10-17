import type { Application } from 'pixi.js'
import { Game } from '#lib/scripts/game/game.ts'
import { TerrainLayer } from '#lib/scripts/pixi/tiles/terrainLayer.ts'

export class GameController {
	private game: Game
	private terrainLayer: TerrainLayer
	static setup(app: Application) {
		return new GameController(app)
	}
	constructor(app: Application) {
		this.game = new Game()
		this.terrainLayer = new TerrainLayer()
		app.stage.addChild(this.terrainLayer)
	}
	setLevel(levelId: string) {
		const level = this.game.setLevel(levelId)
		this.terrainLayer.setLevel(level)
	}
}
