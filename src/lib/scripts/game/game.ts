import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'
import { TreasureManager } from '#lib/scripts/game/treasureManager.ts'
import { CoolCountdown } from '#lib/scripts/utils/coolCountdown.ts'
import { SongPlayer } from '#lib/scripts/audio/songPlayer.ts'

const EXTRA_LIFE = 25000
const SCORE_ROLLING_SPEED = 2000

export type Bonuses = {
	treasureBonus: number
	waveBonus: number
}

export type RoundOutcome = 'inProgress' | 'playerDied' | 'waveCleared'

class Game {
	public level: LevelInstance | undefined
	private rollingScore = new CoolCounter()
	private targetScore = 0
	lives = 5
	wave = 1
	public playerDied = CoolEvents.createHandler()
	public waveCleared = CoolEvents.createHandler<(bonuses: Bonuses) => void>()
	public scoreAdded = CoolEvents.createHandler<(amount: number, sourcePosition?: XY) => void>()
	public treasures = new TreasureManager()
	#screenFadeCountdown: CoolCountdown | undefined
	roundOutcome: RoundOutcome = 'inProgress'
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
		this.rollingScore.addInterval(EXTRA_LIFE, () => {
			SongPlayer.playDitty('extraLife')
			this.lives++
		})
	}
	get loops() {
		return this.level?.loops ?? 1
	}
	nextWave() {
		console.log('nextWave')
		this.wave++
	}
	setWave(wave: number) {
		console.log('setWave', wave)
		this.wave = wave
	}
	update(delta: number) {
		if (!this.level) {
			return
		}
		this.updateScore(delta)
		this.level.update(delta)
		if (this.#screenFadeCountdown?.countdown(delta).finished) {
			this.#screenFadeCountdown = undefined
		}
	}
	prepareLevel() {
		const lvl = LevelsManager.getWave(this.wave)
		this.roundOutcome = 'inProgress'
		this.level = new LevelInstance(this, lvl.def, lvl.loops)
		this.level.player.destroyed.listen(() => {
			if (this.roundOutcome !== 'inProgress') {
				return
			}
			SongPlayer.playSong('dead')
			this.roundOutcome = 'playerDied'
			this.#screenFadeCountdown = new CoolCountdown(2, () => {
				if (!this.isTestMode) {
					this.lives--
				}
				this.playerDied.emit()
			})
		})
		this.level.waveCleared.listen(() => {
			if (this.roundOutcome !== 'inProgress') {
				return
			}
			SongPlayer.playSong('win')
			this.roundOutcome = 'waveCleared'
			this.#screenFadeCountdown = new CoolCountdown(3, () => {
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
		if (this.level) {
			this.level.end()
		}
	}
	updateScore(delta: number) {
		if (this.targetScore <= this.rollingScore.value) {
			// TODO: stop rolling score sound
			this.rollingScore.value = this.targetScore
			return
		}
		// TODO: maintain rolling score sound
		const change = Math.round(
			Math.min(this.targetScore - this.rollingScore.value, delta * SCORE_ROLLING_SPEED),
		)
		this.rollingScore.value += change
	}
	addScore(amount: number, sourcePosition?: XY) {
		this.targetScore += amount
		this.scoreAdded.emit(amount, sourcePosition)
	}
	#finishWaveAndGrantBonuses() {
		if (!this.level) {
			throw 'No level'
		}
		this.treasures.set(this.wave, this.level.collectedTreasure)
		const treasureBonus = this.level.collectedTreasure ? this.treasures.collectedCount * 1000 : 0
		const waveBonus = 500 * this.wave
		this.waveCleared.emit({
			treasureBonus,
			waveBonus,
		})
		this.targetScore += treasureBonus + waveBonus
	}
}

export default Game
