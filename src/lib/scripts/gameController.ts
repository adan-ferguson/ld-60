import type { Application } from 'pixi.js'
import { Game } from '#lib/scripts/game/game.ts'
import { TerrainLayer } from '#lib/scripts/pixi/tiles/terrainLayer.ts'
import { EntitiesLayer } from '#lib/scripts/pixi/tiles/entitiesLayer.ts'

export class GameController {
	private game: Game
	private terrainLayer: TerrainLayer
	private entitiesLayer: EntitiesLayer
	static setup(app: Application) {
		return new GameController(app)
	}
	constructor(app: Application) {
		this.game = new Game()
		this.terrainLayer = new TerrainLayer()
		this.entitiesLayer = new EntitiesLayer(this.game)
		app.stage.addChild(this.terrainLayer, this.entitiesLayer)
		app.ticker.add((ticker) => {
			this.game.update(ticker.deltaMS)
			this.entitiesLayer.update(ticker.deltaMS)
		})
	}
	setLevel(levelId: string) {
		const level = this.game.setLevel(levelId)
		this.terrainLayer.setLevel(level)
		this.game.resume()
	}
}
