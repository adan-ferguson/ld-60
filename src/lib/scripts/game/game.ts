import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'
import { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

export class Game {
	public level: LevelInstance | undefined
	static async load() {
		return new Game()
	}
	constructor() {}
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
}
