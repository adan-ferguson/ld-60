import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'

const EXTRA_LIFE = 25000
const SCORE_ROLLING_SPEED = 2000

export type Bonuses = {
	timeBonus: number
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
	get activeEntities(): GameEntity[] {
		return this.level?.entitiesManager.activeEntities ?? []
	}
	get score() {
		return this.rollingScore.value
	}
	static async load() {
		return new Game()
	}
	constructor(wave: number = 1) {
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
		this.setWave(this.wave + 1)
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
	}
	prepareLevel() {
		const lvl = LevelsManager.getWave(this.wave)
		this.level = new LevelInstance(this, lvl.def, lvl.loops)
		this.level.player.destroyed.listen(() => {
			this.playerDied.emit(this.lives)
		})
		this.level.waveCleared.listen(() => {
			this.waveCleared.emit({
				timeBonus: Math.max(0, 6000 - Math.round(this.level!.roundTimer.value * 100)),
				waveBonus: 1000 * this.wave,
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
}

export default Game
