import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import { Level002 } from '#lib/scripts/game/levels/level002.ts'
import { Level003 } from '#lib/scripts/game/levels/level003.ts'
import { Level004 } from '#lib/scripts/game/levels/level004.ts'
import { Level001 } from '#lib/scripts/game/levels/level001.ts'

const levels: LevelDef[] = [Level001, Level002, Level003, Level004]

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
	getWave(wave: number) {
		wave = Math.round(wave)
		if (wave < 1) {
			throw new Error(`Wave must be greater than 0, got ${wave}`)
		}
		const loops = Math.ceil(wave / levels.length)
		const index = (wave - 1) % levels.length
		const levelDef = levels[index]!
		return { def: levelDef, loops }
	}
}
