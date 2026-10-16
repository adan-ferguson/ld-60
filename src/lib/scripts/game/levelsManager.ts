import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export class LevelsManager {
	private static instance: LevelsManager
	private static getInstance(): LevelsManager {
		if (!LevelsManager.instance) {
			LevelsManager.instance = new LevelsManager()
		}
		return LevelsManager.instance
	}
	static get(id: string) {
		return LevelsManager.getInstance().levels.get(id)
	}

	private levels: Map<string, LevelDef> = new Map()

	constructor() {}
}
