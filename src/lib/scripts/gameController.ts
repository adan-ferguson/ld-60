import type { Application } from 'pixi.js'
import { Game } from '#lib/scripts/game/game.ts'
import { TerrainLayer } from '#lib/scripts/pixi/tiles/terrainLayer.ts'
import { EntitiesLayer } from '#lib/scripts/pixi/tiles/entitiesLayer.ts'
import { VfxLayer } from '#lib/scripts/pixi/tiles/vfxLayer.ts'

export class GameController {
	private game: Game
	private terrainLayer: TerrainLayer
	private entitiesLayer: EntitiesLayer
	private vfxLayer: VfxLayer
	static setup(app: Application) {
		return new GameController(app)
	}
	constructor(app: Application) {
		this.game = new Game()
		this.terrainLayer = new TerrainLayer()
		this.entitiesLayer = new EntitiesLayer(this.game)
		this.vfxLayer = new VfxLayer()
		app.stage.addChild(this.terrainLayer, this.entitiesLayer, this.vfxLayer)
		app.ticker.add((ticker) => {
			this.game.update(ticker.deltaMS)
			this.vfxLayer.update(ticker.deltaMS)
		})
	}
	setLevel(levelId: string) {
		const level = this.game.setLevel(levelId)
		this.terrainLayer.setLevel(level)
		// this.soundManager.setMusic('spawn')
		this.vfxLayer.addAnimation(
			new SomeAnimation({
				onFinish: () => {
					// this.soundManager.setMusic('gameplay')
					this.game.beginLevel()
				},
			}),
		)
	}
}
