import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Player } from '#lib/scripts/game/player/player.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { EntitiesManager } from '#lib/scripts/game/entitiesManager.ts'

class Game {
	public level: LevelInstance | undefined
	private player: Player
	private playing = false
	public entitiesManager: EntitiesManager
	private roundTimer = 0
	private turretTimer = 0
	private get turretShotInterval() {
		return 5 // TODO: scale up with round time and level
	}
	static async load() {
		return new Game()
	}
	constructor() {
		this.player = new Player(this)
		this.entitiesManager = new EntitiesManager(this)
	}
	get activeEntites(): GameEntity[] {
		return [this.player, ...this.entitiesManager.entities].filter((e) => e.isActive)
	}
	get levels(): LevelDef[] {
		return []
	}
	setLevel(levelId: string) {
		const lvl = LevelsManager.instance.levels.get(levelId)
		if (!lvl) {
			throw new Error(`Level ${levelId} not found`)
		}
		this.level = new LevelInstance(this, lvl)
		this.entitiesManager.setLevel(this.level)
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
	}
	beginLevel() {
		this.player.position = this.level!.playerSpawnPosition
		this.player.y -= 2 // offset player up a bit so they don't spawn inside the floor
		this.player.isActive = true
		this.playing = true
		this.roundTimer = 0
		this.turretTimer = 0
	}
}

export default Game
