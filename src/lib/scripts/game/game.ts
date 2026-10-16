import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export class Game {
	static async load() {
		return new Game()
	}
	constructor() {}
	get levels(): LevelDef[] {
		return []
	}
}
