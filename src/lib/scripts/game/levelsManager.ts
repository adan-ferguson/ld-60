import type { OldLevelDef } from '#lib/scripts/game/oldLevelDef.ts'

const levelIds = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010']

export class LevelsManager {
	private static _levelCache: Map<string, OldLevelDef> = new Map()
	private static _instance: LevelsManager
	public static async preloadAll() {
		return await Promise.all(levelIds.map((id) => LevelsManager.load(id)))
	}
	public static async load(id: string): Promise<OldLevelDef> {
		if (!this._levelCache.has(id)) {
			const response = await fetch(`/levels/${id}.json`)
			if (!response.ok) {
				throw new Error(`Could not load level ${id}`)
			}
			const level = (await response.json()) as OldLevelDef
			this._levelCache.set(id, level)
		}
		return this._levelCache.get(id)!
	}
	public static get instance(): LevelsManager {
		if (!this._instance) {
			this._instance = new LevelsManager()
		}
		return this._instance
	}
	public levels: Map<string, OldLevelDef> = new Map()
	getLevel(wave: number) {
		wave = Math.round(wave)
		if (wave < 1) {
			throw new Error(`Wave must be greater than 0, got ${wave}`)
		}
		const loops = Math.ceil(wave / levelIds.length)
		const index = (wave - 1) % levelIds.length
		const def = LevelsManager._levelCache.get(levelIds[index]!)
		if (!def) {
			throw 'Level not found in cache, make sure to call LevelsManager.preloadAll() before calling getLevel()'
		}
		return { def, loops }
	}

	static isValidId(id: string) {
		return levelIds.includes(id)
	}

	static isValidWave(wave: number) {
		return Number.isInteger(wave) && wave >= 1
	}
}
