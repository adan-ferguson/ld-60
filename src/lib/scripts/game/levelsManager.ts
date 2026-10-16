import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import { Level001 } from '#lib/scripts/game/levels/level001.ts'

const levels: LevelDef[] = [Level001]

export class LevelsManager {
	private static _instance: LevelsManager
	public static get instance(): LevelsManager {
		if (!this._instance) {
			this._instance = new LevelsManager()
		}
		return this._instance
	}
	public levels: Map<string, LevelDef> = new Map()
	constructor() {
		for (const levelDef of levels) {
			this.levels.set(levelDef.id, levelDef)
		}
	}
}
