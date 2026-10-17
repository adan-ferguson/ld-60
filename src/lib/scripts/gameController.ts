import type { Application } from 'pixi.js'
import { Game } from '#lib/scripts/game/game.ts'
import { TileLayer } from '#lib/scripts/pixi/tiles/tileLayer.ts'

export class GameController {
	private game: Game
	private tileLayer: TileLayer
	static setup(app: Application) {
		return new GameController(app)
	}
	constructor(app: Application) {
		this.game = new Game()
		this.tileLayer = new TileLayer()
		app.stage.addChild(this.tileLayer)
	}
	setLevel(levelId: string) {
		const level = this.game.setLevel(levelId)
		this.tileLayer.setLevel(level)
	}
}
