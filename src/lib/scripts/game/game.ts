import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'
import { TreasureManager } from '#lib/scripts/game/treasureManager.ts'

const EXTRA_LIFE = 25000
const SCORE_ROLLING_SPEED = 2000
const WAVE_CLEAR_DELAY = 3

export type Bonuses = {
	treasureBonus: number
	waveBonus: number
}

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
	#isWaveCleared = false
	#waveClearTimer = 0
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
			// TODO: play extra life sound
			this.lives++
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
	update(delta: number) {
		if (!this.level) {
			return
		}
		this.updateScore(delta)
		this.level.update(delta)
		this.#waveClearTimer = Math.max(0, this.#waveClearTimer - delta)
		if (this.#isWaveCleared && this.#waveClearTimer <= 0) {
			this.#finishWaveAndGrantBonuses()
		}
	}
	prepareLevel() {
		const lvl = LevelsManager.getWave(this.wave)
		this.level = new LevelInstance(this, lvl.def, lvl.loops)
		this.level.player.destroyed.listen(() => {
			this.playerDied.emit(this.lives)
		})
		this.level.waveCleared.listen(() => {
			this.#isWaveCleared = true
			this.#waveClearTimer = WAVE_CLEAR_DELAY
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
		this.waveCleared.emit({
			treasureBonus: this.treasures.collectedCount * 1000,
			waveBonus: 750 + 250 * this.wave,
		})
		this.targetScore += this.treasures.collectedCount * 1000 + 750 + 250 * this.wave
		this.#isWaveCleared = false
		this.#waveClearTimer = 0
	}
}

export default Game
