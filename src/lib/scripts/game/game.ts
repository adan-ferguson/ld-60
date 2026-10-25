import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Player } from '#lib/scripts/game/player/player.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { EntitiesManager } from '#lib/scripts/game/entitiesManager.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { Treasure } from '#lib/scripts/game/treasure.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { TerrainCollision } from '#lib/scripts/game/terrainCollision.ts'

const EXTRA_LIFE = 25000
const TREASURE_SPAWN_TIME = 10
const EVIL_GUY_SPAWN_TIME = 30
const SCORE_ROLLING_SPEED = 2000

export type Bonuses = {
	timeBonus: number
	waveBonus: number
	arbitraryBonus: number
}

class Game {
	public level!: LevelInstance
	player: Player
	playing = false
	public entitiesManager: EntitiesManager
	private roundTimer = 0
	private turretTimer = 0
	private rollingScore = 0
	private targetScore = 0
	lives = 3
	wave = 1
	public playerDied = CoolEvents.createHandler()
	public waveCleared = CoolEvents.createHandler<(bonuses: Bonuses) => void>()
	public scoreAdded = CoolEvents.createHandler<(amount: number, sourcePosition?: XY) => void>()
	public terrainCollision: TerrainCollision
	private waveClearedEmitted = false
	get score() {
		return this.rollingScore
	}
	private get turretShotInterval() {
		return 4 - Math.min(3, this.roundTimer * 0.02 + this.loops * 0.6)
	}
	static async load() {
		return new Game()
	}
	constructor(wave: number = 1) {
		this.player = new Player(this)
		this.player.destroyed.listen(() => {
			this.playerDied.emit(this.lives)
		})
		this.player.isActive = false
		this.entitiesManager = new EntitiesManager(this)
		this.terrainCollision = new TerrainCollision(this)
		this.setWave(wave)
	}
	get activeEntites(): GameEntity[] {
		return [this.player, ...this.entitiesManager.entities].filter((e) => e.isActive)
	}
	get loops() {
		return this.level?.loops ?? 1
	}
	nextWave() {
		this.setWave(this.wave + 1)
	}
	setWave(wave: number) {
		const lvl = LevelsManager.getWave(wave)
		this.wave = wave
		this.level = new LevelInstance(this, lvl.def, lvl.loops)
		return this.level
	}
	update(delta: number) {
		if (!this.playing) {
			return
		}
		this.updateScore(delta)
		this.player?.update(delta)
		this.entitiesManager.update(delta)
		if (crossedThreshold(TREASURE_SPAWN_TIME, this.roundTimer, delta)) {
			this.spawnTreasure()
		}
		// if (crossedThreshold(EVIL_GUY_SPAWN_TIME, this.roundTimer, delta)) {
		// 	this.spawnEvilGuy()
		// }
		this.roundTimer += delta
		this.turretTimer += delta
		if (this.turretTimer > this.turretShotInterval) {
			this.entitiesManager.fireRandomTurret()
			this.turretTimer = 0
		}
		if (!this.entitiesManager.hasEnemy && !this.waveClearedEmitted) {
			this.waveClear()
		}
	}
	waveClear() {
		this.waveCleared.emit({
			timeBonus: Math.max(0, 6000 - Math.round(this.roundTimer * 100)),
			waveBonus: 1000 * this.wave,
			arbitraryBonus: Math.round(2000 * Math.random()),
		})
		this.waveClearedEmitted = true
	}
	beginLevel() {
		this.entitiesManager.reset()
		this.player.resetState()
		this.player.position = this.level!.playerSpawnPosition
		this.player.y -= 2 // offset player up a bit so they don't spawn inside the floor
		this.player.isActive = true
		this.playing = true
		this.waveClearedEmitted = false
		this.roundTimer = 0
		this.turretTimer = 0
	}
	spawnTreasure() {
		if (!this.level) {
			return
		}
		this.entitiesManager.spawn(new Treasure(this, this.level.getTreasureSpawnPosition()))
	}
	updateScore(delta: number) {
		if (this.targetScore <= this.rollingScore) {
			// TODO: stop rolling score sound
			this.rollingScore = this.targetScore
			return
		}
		// TODO: maintain rolling score sound
		const change = Math.round(
			Math.min(this.targetScore - this.rollingScore, delta * SCORE_ROLLING_SPEED),
		)
		const extraLives = intervalsCrossed(EXTRA_LIFE, this.rollingScore, change)
		if (extraLives > 0) {
			// TODO: play extra life sound
			this.lives += extraLives
		}
		this.rollingScore += change
	}
	addScore(amount: number, sourcePosition?: XY) {
		this.targetScore += amount
		this.scoreAdded.emit(amount, sourcePosition)
	}
	spawnEvilGuy() {
		// if (!this.level) {
		// 	return
		// }
		// const pos = this.level.getTreasureSpawnPosition()
		// this.entitiesManager.spawn(new EvilGuy(this, pos))
	}
}

function crossedThreshold(threshold: number, currentTime: number, delta: number) {
	return currentTime < threshold && currentTime + delta >= threshold
}

function intervalsCrossed(interval: number, currentValue: number, delta: number) {
	const before = Math.floor(currentValue / interval)
	const after = Math.floor((currentValue + delta) / interval)
	return after - before
}

export default Game
