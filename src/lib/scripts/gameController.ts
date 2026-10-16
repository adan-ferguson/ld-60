import type { Application } from 'pixi.js'
import { Game } from '#lib/scripts/game/game.ts'

export class GameController {
	private game: Game
	static setup(app: Application) {
		new GameController(app)
	}
	constructor(app: Application) {
		this.game = new Game()
	}
}
