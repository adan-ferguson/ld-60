import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Player } from '#lib/scripts/game/player/player.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { EntitiesManager } from '#lib/scripts/game/entitiesManager.ts'

export class Game {
	public level: LevelInstance | undefined
	private player: Player
	private playing = false
	public entitiesManager: EntitiesManager
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
		return this.level
	}
	update(delta: number) {
		if (!this.playing) {
			return
		}
		this.player?.update(delta)
		this.entitiesManager.update(delta)
	}
	beginLevel() {
		this.player.position = this.level!.playerSpawnPosition
		this.player.y -= 2 // offset player up a bit so they don't spawn inside the floor
		this.player.isActive = true
		this.playing = true
	}
}
