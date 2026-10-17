import type { Game } from '#lib/scripts/game/game.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import type { XYMap } from '#lib/scripts/utils/XYMap.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { TerrainCollision } from '#lib/scripts/game/terrainCollision.ts'

export class LevelInstance {
	tiles: XYMap<TileDef>
	playerSpawnPosition: XY
	public terrainCollision: TerrainCollision
	constructor(game: Game, levelDef: LevelDef) {
		const { spawnPosition, tiles } = TileDef.parseLevel(levelDef.tiles)
		this.tiles = tiles
		this.playerSpawnPosition = TileDef.toWorldXY(spawnPosition)
		this.terrainCollision = new TerrainCollision(tiles)
	}
}
