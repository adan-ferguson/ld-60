import type { Application } from 'pixi.js'
import Game, { type Bonuses } from '#lib/scripts/game/game.ts'
import { EntitiesLayer } from '#lib/scripts/pixi/entities/entitiesLayer.ts'
import { TerrainLayer } from '#lib/scripts/pixi/terrain/terrainLayer.ts'
import { VfxLayer } from '#lib/scripts/pixi/vfx/vfxLayer.ts'
import { playerSpawnAnimation } from '#lib/scripts/pixi/vfx/playerSpawnAnimation.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { getInputState } from '#lib/scripts/game/player/inputManager.ts'
import { isHighScore } from '#lib/scripts/game/highScores.ts'

export type ScreenPhase =
	| { kind: 'prewave'; wave: number }
	| { kind: 'wave' }
	| {
			kind: 'postwave'
			bonuses: Bonuses
	  }
	| {
			kind: 'gameover'
			score: number
			isHighScore: boolean
	  }

export class GameController {
	public game: Game | undefined
	private terrainLayer: TerrainLayer
	private entitiesLayer: EntitiesLayer
	private screenPhase: ScreenPhase = { kind: 'prewave', wave: 1 }
	public vfxLayer: VfxLayer
	public started = CoolEvents.createHandler()
	public stopped = CoolEvents.createHandler()
	public updated = CoolEvents.createHandler<(delta: number) => void>()
	public phaseChanged = CoolEvents.createHandler<(phase: ScreenPhase) => void>()
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
				app.stage.visible = false
				const { button1, button2 } = getInputState()
				if (button1 || button2) {
					this.startGame()
				}
				return
			}
			app.stage.visible = true
			const delta = ticker.deltaMS / 1000
			this.game.update(delta)
			this.entitiesLayer.update()
			this.vfxLayer.update(delta)
			this.updated.emit(delta)
		})
	}
	startGame(wave: number = 1) {
		this.game = new Game(wave)
		this.game.playerDied.listen(() => {
			const gameOver = !this.game?.lives
			setTimeout(() => {
				if (gameOver) {
					this.gameOver()
				} else {
					this.preWave()
				}
			}, 2400)
		})
		this.game.waveCleared.listen((bonuses) => {
			setTimeout(() => {
				if (!this.game) {
					return
				}
				this.setScreenPhase({
					kind: 'postwave',
					bonuses,
				})
				this.game.score += bonuses.timeBonus + bonuses.waveBonus + bonuses.arbitraryBonus
				this.game.nextWave()
			}, 2000)
		})
		this.started.emit()
		this.preWave()
	}
	gameOver() {
		const score = this.game?.score ?? 0
		this.setScreenPhase({ kind: 'gameover', score, isHighScore: isHighScore(score) })
		setTimeout(() => {
			this.stopped.emit()
			this.game = undefined
		}, 6000)
	}
	preWave() {
		this.setScreenPhase({ kind: 'prewave', wave: this.game?.wave ?? 1 })
		setTimeout(() => {
			this.startLevel()
		}, 2500)
	}
	setScreenPhase(phase: ScreenPhase) {
		if (!this.game) {
			return
		}
		this.game.playing = false
		this.screenPhase = phase
		this.phaseChanged.emit(phase)
	}
	startLevel() {
		if (!this.game) {
			throw 'No game'
		}
		this.setScreenPhase({ kind: 'wave' })
		const level = this.game.level!
		this.terrainLayer.setLevel(level)
		// this.soundManager.setMusic('spawn')
		this.vfxLayer.addAnimation(
			playerSpawnAnimation({
				targetPosition: level.playerSpawnPosition,
				onFinished: () => {
					if (!this.game) {
						return
					}
					// this.soundManager.setMusic('gameplay')
					this.game.beginLevel()
				},
			}),
		)
	}
}
