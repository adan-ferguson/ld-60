import type { Game } from '#lib/scripts/game/game.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export class LevelInstance {
	public tiles: TileDef[]
	constructor(game: Game, levelDef: LevelDef) {
		this.tiles = TileDef.parseLevel(levelDef.tiles)
	}
}
