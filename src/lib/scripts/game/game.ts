import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'
import { TreasureManager } from '#lib/scripts/game/treasureManager.ts'
import { CoolCountdown } from '#lib/scripts/utils/coolCountdown.ts'
import { MusicPlayer } from '#lib/scripts/audio/musicPlayer.ts'
import { SfxPlayer } from '#lib/scripts/audio/sfxPlayer.ts'
import { CoolAudio, type PlaybackHandle } from '#lib/scripts/audio/coolAudio.ts'
import { getInputState } from '#lib/scripts/game/player/inputManager.ts'

const EXTRA_LIFE = 25000
const SCORE_ROLLING_SPEED = 4000
const STARTING_LIVES = 1

export type Bonuses = {
	treasureBonus: number
	waveBonus: number
}

export type RoundOutcome = 'inProgress' | 'playerDied' | 'waveCleared'

class Game {
	level: LevelInstance | undefined
	private rollingScore = new CoolCounter()
	private targetScore = new CoolCounter()
	lives = STARTING_LIVES
	wave = 1
	playerDied = CoolEvents.createHandler()
	waveCleared = CoolEvents.createHandler<(bonuses: Bonuses) => void>()
	scoreAdded = CoolEvents.createHandler<(amount: number, sourcePosition?: XY) => void>()
	extraLifeGained = CoolEvents.createHandler()
	treasures = new TreasureManager()
	private screenFadeCountdown: CoolCountdown | undefined
	private roundOutcome: RoundOutcome = 'inProgress'
	private scoreCountingSfx: PlaybackHandle | undefined
	private pauseWasDown = false
	paused = false
	get activeEntities(): GameEntity[] {
		return this.level?.entitiesManager.activeEntities ?? []
	}
	get score() {
		return this.rollingScore.value
	}
	static async load() {
		return new Game()
	}
	constructor(
		wave: number = 1,
		private isTestMode = false,
	) {
		this.setWave(wave)
		this.targetScore.addInterval(EXTRA_LIFE, () => {
			SfxPlayer.play('extraLife')
			this.lives++
			this.extraLifeGained.emit()
		})
	}
	get loops() {
		return this.level?.loops ?? 1
	}
	nextWave() {
		this.wave++
	}
	setWave(wave: number) {
		this.wave = wave
	}
	continued() {
		this.lives = STARTING_LIVES
		this.targetScore.value /= 2
	}
	update(delta: number) {
		this.updateScore(delta)
		if (!this.level?.running) {
			return
		}
		const pauseDown = getInputState().pause
		if (pauseDown && !this.pauseWasDown) {
			this.paused = !this.paused
			if (this.paused) {
				CoolAudio.pause()
			} else {
				CoolAudio.resume()
			}
		}
		this.pauseWasDown = pauseDown
		if (this.paused) {
			return
		}
		this.level.update(delta)
		if (this.screenFadeCountdown?.countdown(delta).finished) {
			this.screenFadeCountdown = undefined
		}
	}
	prepareLevel() {
		const lvl = LevelsManager.getWave(this.wave)
		this.roundOutcome = 'inProgress'
		this.level = new LevelInstance(this, lvl.def, this.wave)
		this.level.player.destroyed.listen(() => {
			if (this.roundOutcome !== 'inProgress') {
				return
			}
			this.roundOutcome = 'playerDied'
			this.screenFadeCountdown = new CoolCountdown(2, () => {
				this.lives--
				this.playerDied.emit()
			})
		})
		this.level.waveCleared.listen(() => {
			SfxPlayer.play('win')
			MusicPlayer.stop()
			this.roundOutcome = 'waveCleared'
			if (this.screenFadeCountdown) {
				// If player died but then wave got cleared, tie goes to the player.
				// This countdown won't finish because it'll be overwritten, and it won't be ticked anymore.
			}
			this.screenFadeCountdown = new CoolCountdown(3, () => {
				this.#finishWaveAndGrantBonuses()
			})
		})
		return this.level
	}
	beginLevel() {
		if (!this.level) {
			throw 'Level not set'
		}
		this.level.begin()
	}
	endLevel() {
		this.level?.end()
	}
	updateScore(delta: number) {
		if (this.targetScore.value <= this.rollingScore.value) {
			this.scoreCountingSfx?.stop()
			this.scoreCountingSfx = undefined
			this.rollingScore.value = this.targetScore.value
			return
		}
		if (!this.scoreCountingSfx) {
			this.scoreCountingSfx = SfxPlayer.play('scoreCounting')
		}
		const change = Math.round(
			Math.min(this.targetScore.value - this.rollingScore.value, delta * SCORE_ROLLING_SPEED),
		)
		this.rollingScore.value += change
	}
	addScore(amount: number, sourcePosition?: XY) {
		this.targetScore.value += amount
		this.scoreAdded.emit(amount, sourcePosition)
	}
	#finishWaveAndGrantBonuses() {
		if (!this.level) {
			throw 'No level'
		}
		this.treasures.set(this.wave, this.level.collectedTreasure)
		const treasureBonus = this.level.collectedTreasure ? this.treasures.collectedCount * 1000 : 0
		const waveBonus = 1000 * this.wave
		this.waveCleared.emit({
			treasureBonus,
			waveBonus,
		})
		this.targetScore.value += treasureBonus + waveBonus
	}
}

export default Game
