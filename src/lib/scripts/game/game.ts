import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Player } from '#lib/scripts/game/player/player.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export class Game {
	public level: LevelInstance | undefined
	private player: Player
	private playing = false
	static async load() {
		return new Game()
	}
	constructor() {
		this.player = new Player(this)
	}
	get activeEntites(): GameEntity[] {
		return [this.player].filter((e) => e.isActive)
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
		this.player.position = this.level.playerSpawnPosition
		return this.level
	}

	update(deltaMS: number) {
		if (!this.playing) {
			return
		}
		this.player?.update(deltaMS)
	}

	beginLevel() {
		this.player.position = this.level!.playerSpawnPosition
		this.player.isActive = true
		this.playing = true
	}
}
