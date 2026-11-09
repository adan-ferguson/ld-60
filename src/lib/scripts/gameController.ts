import { type Application } from 'pixi.js'
import Game, { type Bonuses } from '#lib/scripts/game/game.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { getInputState } from '#lib/scripts/game/player/inputManager.ts'
import { addHighScore, isHighScore } from '#lib/scripts/game/highScores.ts'
import { MainContainer } from '#lib/scripts/pixi/mainContainer.ts'
import type { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { FlyingTextController } from '#lib/scripts/sv/flyingTextController.svelte.ts'
import { Cutscene } from '#lib/scripts/cutscene.ts'

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

export type CutscenePhase = {
	kind: 'cutscene'
	cutscene: Cutscene
}

export type ScreenPhase =
	| PreWavePhase
	| WavePhase
	| PostWavePhase
	| GameOverPhase
	| TitlePhase
	| HighScoresPhase
	| AttractPhase
	| CutscenePhase

export class GameController {
	public game: Game | undefined
	public updated = CoolEvents.createHandler()
	public phaseChanged = CoolEvents.createHandler()
	public cutsceneStarted = CoolEvents.createHandler<(cutscene: Cutscene) => void>()
	public phase: ScreenPhase = { kind: 'title' }
	public flyingTextController = new FlyingTextController()
	private waveCleared = false
	private mainContainer: MainContainer
	#cutscene: Cutscene | undefined
	static setup(app: Application, testWave?: number) {
		return new GameController(app, testWave)
	}
	constructor(
		private app: Application,
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
			this.#cutscene?.update(delta)
		})
	}
	startGame() {
		const game = new Game(this.testWave, this.isTestMode)
		this.game = game
		game.scoreAdded.listen((amount, pos) => {
			if (pos) {
				this.flyingTextController.addScore(amount, pos)
			}
		})
		game.playerDied.listen(() => {
			setTimeout(() => {
				if (this.waveCleared) {
					return
				}
				if (!this.isTestMode) {
					game.lives--
				}
				if (!game.lives) {
					this.gameOver()
				} else {
					this.preWave()
				}
			}, 2400)
		})
		game.waveCleared.listen((bonuses) => {
			this.waveCleared = true
			if (!this.game) {
				return
			}
			this.setScreenPhase({
				kind: 'postwave',
				wave: this.game.wave,
				bonuses,
			})
			setTimeout(() => {
				if (0 && this.isTestMode) {
					this.preWave()
				} else if (game.wave % 10 === 0) {
					this.#showCutscene(1)
				} else {
					game.nextWave()
					this.preWave()
				}
			}, 4000)
		})
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
		if (!this.game) {
			throw 'No game'
		}
		this.setScreenPhase({ kind: 'prewave', wave: this.game.wave ?? 1 })
		this.game.prepareLevel()
		setTimeout(() => {
			this.startLevel()
		}, 2500)
	}
	setScreenPhase(phase: ScreenPhase) {
		if (!this.game) {
			return
		}
		if (phase.kind !== 'wave') {
			this.game.endLevel()
		}
		this.phase = phase
		this.phaseChanged.emit(phase)
	}
	startLevel() {
		const game = this.game
		if (!game?.level) {
			throw 'No game'
		}
		this.setScreenPhase({ kind: 'wave' })
		this.waveCleared = false
		// this.soundManager.setMusic('spawn')
		this.mainContainer.showPlayerSpawnAnimation(game.level).then(() => {
			game.beginLevel()
			// this.soundManager.setMusic('spawn')
		})
	}

	addAnimation(vfxAnimation: VfxAnimation) {
		this.mainContainer.vfxLayer.addAnimation(vfxAnimation)
	}

	#showCutscene(index: number) {
		this.#cutscene = new Cutscene(index)
		const { container } = this.#cutscene
		this.app.stage.addChild(container)
		this.setScreenPhase({
			kind: 'cutscene',
			cutscene: this.#cutscene,
		})
		this.#cutscene.finished.listen(() => {
			this.app.stage.removeChild(container)
			this.#cutscene = undefined
			this.gameOver()
			// this.nextWave()
			// this.preWave()
		})
	}
}
