import { type Application } from 'pixi.js'
import Game, { type Bonuses } from '#lib/scripts/game/game.ts'
import { playerSpawnAnimation } from '#lib/scripts/pixi/vfx/playerSpawnAnimation.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { getInputState } from '#lib/scripts/game/player/inputManager.ts'
import { addHighScore, isHighScore } from '#lib/scripts/game/highScores.ts'
import { MainContainer } from '#lib/scripts/pixi/mainContainer.ts'
import type { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { FlyingTextController } from '#lib/scripts/sv/flyingTextController.svelte.ts'

export type PreWavePhase = {
	kind: 'prewave'
	wave: number
}

export type WavePhase = {
	kind: 'wave'
}

export type PostWavePhase = {
	kind: 'postwave'
	wave: number
	bonuses: Bonuses
}

export type GameOverPhase = {
	kind: 'gameover'
	score: number
	isHighScore: boolean
}

export type TitlePhase = {
	kind: 'title'
}

export type HighScoresPhase = {
	kind: 'highscores'
}

export type AttractPhase = {
	kind: 'attract'
}

export type ScreenPhase =
	| PreWavePhase
	| WavePhase
	| PostWavePhase
	| GameOverPhase
	| TitlePhase
	| HighScoresPhase
	| AttractPhase
export class GameController {
	public game: Game | undefined
	public updated = CoolEvents.createHandler()
	public phaseChanged = CoolEvents.createHandler()
	public phase: ScreenPhase = { kind: 'title' }
	public flyingTextController = new FlyingTextController()
	private waveCleared = false
	private mainContainer: MainContainer
	static setup(app: Application, testWave?: number) {
		return new GameController(app, testWave)
	}
	constructor(
		app: Application,
		private testWave?: number,
	) {
		this.mainContainer = new MainContainer(this)
		app.stage.addChild(this.mainContainer)
		this.setupTicker(app)
		if (this.isTestMode) {
			this.startGame()
		}
	}
	get isTestMode() {
		return this.testWave !== undefined
	}
	private setupTicker(app: Application) {
		app.ticker.add((ticker) => {
			const delta = ticker.deltaMS / 1000
			this.flyingTextController.update(delta)
			this.mainContainer.update(delta)
			if (!this.game) {
				const { button1, button2 } = getInputState()
				if (button1 || button2) {
					this.startGame()
				}
				return
			}
			this.game.update(delta)
			this.updated.emit(delta)
		})
	}
	startGame() {
		this.game = new Game(this.testWave)
		this.game.scoreAdded.listen((amount, pos) => {
			if (pos) {
				this.flyingTextController.addScore(amount, pos)
			}
		})
		this.game.playerDied.listen(() => {
			setTimeout(() => {
				if (this.waveCleared || !this.game) {
					return
				}
				if (!this.isTestMode) {
					this.game.lives--
				}
				if (!this.game.lives) {
					this.gameOver()
				} else {
					this.preWave()
				}
			}, 2400)
		})
		this.game.waveCleared.listen((bonuses) => {
			this.waveCleared = true
			setTimeout(() => {
				if (!this.game) {
					return
				}
				this.setScreenPhase({
					kind: 'postwave',
					wave: this.game.wave,
					bonuses,
				})
				this.game.addScore(bonuses.timeBonus + bonuses.waveBonus + bonuses.arbitraryBonus)
				if (!this.isTestMode) {
					this.game.nextWave()
				}
				setTimeout(() => {
					this.preWave()
				}, 2500)
			}, 2000)
		})
		// this.started.emit()
		this.preWave()
	}
	gameOver() {
		const score = this.game?.score ?? 0
		this.setScreenPhase({ kind: 'gameover', score, isHighScore: isHighScore(score) })
		addHighScore(score)
		setTimeout(() => {
			// this.stopped.emit()
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
		this.phase = phase
		this.phaseChanged.emit(phase)
	}
	startLevel() {
		const game = this.game
		if (!game) {
			throw 'No game'
		}
		this.waveCleared = false
		this.setScreenPhase({ kind: 'wave' })
		// this.soundManager.setMusic('spawn')
		this.mainContainer.showPlayerSpawnAnimation(game.level).then(() => {
			game.beginLevel()
			// this.soundManager.setMusic('spawn')
		})
	}

	addAnimation(vfxAnimation: VfxAnimation) {
		this.mainContainer.vfxLayer.addAnimation(vfxAnimation)
	}
}
