import { Level001 } from '#lib/scripts/game/levels/level001.ts'
import { Level002 } from '#lib/scripts/game/levels/level002.ts'
import { Level004 } from '#lib/scripts/game/levels/level004.ts'
import { Level003 } from '#lib/scripts/game/levels/level003.ts'
import { LevelTight } from '#lib/scripts/game/levels/levelTight.ts'
import { LevelMovers } from '#lib/scripts/game/levels/levelMovers.ts'

const levels = [Level001, Level002, Level003, Level004, LevelTight, LevelMovers] as const

const LEVEL_COUNT = levels.length

export const LevelsManager = {
	getWave(wave: number) {
		wave = Math.round(wave)
		if (wave < 1) {
			throw new Error(`Wave must be greater than 0, got ${wave}`)
		}
		const loops = Math.ceil(wave / LEVEL_COUNT)
		const index = (wave - 1) % LEVEL_COUNT
		const def = levels[index]
		if (!def) {
			throw 'Level not found in cache, make sure to call LevelsManager.preloadAll() before calling getLevel()'
		}
		return { def, loops }
	},
	isValidWave(wave: number): boolean {
		return Number.isInteger(wave) && wave >= 1
	},
}
