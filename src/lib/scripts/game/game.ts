import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Player } from '#lib/scripts/game/player/player.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { EntitiesManager } from '#lib/scripts/game/entitiesManager.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'

const EXTRA_LIFE = 50000

export type Bonuses = {
	timeBonus: number
	waveBonus: number
	arbitraryBonus: number
}

class Game {
	public level: LevelInstance | undefined
	player: Player
	playing = false
	public entitiesManager: EntitiesManager
	private roundTimer = 0
	private turretTimer = 0
	lives = 3
	wave = 1
	#score = 0
	public playerDied = CoolEvents.createHandler()
	public waveCleared = CoolEvents.createHandler<(bonuses: Bonuses) => void>()
	private waveClearedEmitted = false
	get score() {
		return this.#score
	}
	set score(value: number) {
		const extraLivesBefore = Math.floor(this.#score / EXTRA_LIFE)
		const extraLivesAfter = Math.floor(value / EXTRA_LIFE)
		if (extraLivesAfter > extraLivesBefore) {
			this.lives += extraLivesAfter - extraLivesBefore
		}
		this.#score = value
	}
	private get turretShotInterval() {
		return 4 - Math.min(3, this.roundTimer * 0.02 + this.loops * 0.5)
	}
	static async load() {
		return new Game()
	}
	constructor(wave: number = 1) {
		this.player = new Player(this)
		this.player.destroyed.listen(() => {
			this.lives--
			this.playerDied.emit(this.lives)
		})
		this.player.isActive = false
		this.entitiesManager = new EntitiesManager(this)
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
		const lvl = LevelsManager.instance.getWave(wave)
		this.wave = wave
		this.level = new LevelInstance(this, lvl.def, lvl.loops)
		return this.level
	}
	update(delta: number) {
		if (!this.playing) {
			return
		}
		this.player?.update(delta)
		this.entitiesManager.update(delta)
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
		this.player.position = this.level!.playerSpawnPosition
		this.player.y -= 2 // offset player up a bit so they don't spawn inside the floor
		this.player.isActive = true
		this.playing = true
		this.waveClearedEmitted = false
		this.roundTimer = 0
		this.turretTimer = 0
	}
}

export default Game
