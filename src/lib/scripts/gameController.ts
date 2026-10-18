import type { Application } from 'pixi.js'
import Game from '#lib/scripts/game/game.ts'
import { EntitiesLayer } from '#lib/scripts/pixi/entities/entitiesLayer.ts'
import { TerrainLayer } from '#lib/scripts/pixi/terrain/terrainLayer.ts'
import { VfxLayer } from '#lib/scripts/pixi/vfx/vfxLayer.ts'
import { playerSpawnAnimation } from '#lib/scripts/pixi/vfx/playerSpawnAnimation.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { getInputState } from '#lib/scripts/game/player/inputManager.ts'

export class GameController {
	public game: Game | undefined
	public started = CoolEvents.createHandler<() => void>()
	private terrainLayer: TerrainLayer
	private entitiesLayer: EntitiesLayer
	public vfxLayer: VfxLayer
	public updated = CoolEvents.createHandler<(delta: number) => void>()
	static setup(app: Application) {
		return new GameController(app)
	}
	constructor(app: Application) {
		this.terrainLayer = new TerrainLayer()
		this.entitiesLayer = new EntitiesLayer(this)
		this.vfxLayer = new VfxLayer()
		app.stage.addChild(this.terrainLayer, this.entitiesLayer, this.vfxLayer)
		app.ticker.add((ticker) => {
			if (!this.game) {
				const { button1, button2 } = getInputState()
				if (button1 || button2) {
					this.startGame()
				}
				return
			}
			const delta = ticker.deltaMS / 1000
			this.game.update(delta)
			this.entitiesLayer.update()
			this.vfxLayer.update(delta)
			this.updated.emit(delta)
		})
	}
	startGame(wave: number = 1) {
		this.game = new Game(wave)
		this.started.emit()
		this.startLevel()
	}
	startLevel() {
		if (!this.game) {
			throw 'No game'
		}
		const level = this.game.level!
		this.terrainLayer.setLevel(level)
		// this.soundManager.setMusic('spawn')
		this.vfxLayer.addAnimation(
			playerSpawnAnimation({
				targetPosition: level.playerSpawnPosition,
				onFinished: () => {
					// this.soundManager.setMusic('gameplay')
					this.game!.beginLevel()
				},
			}),
		)
	}
}
