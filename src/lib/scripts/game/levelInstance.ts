import Game from '#lib/scripts/game/game.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XYMap } from '#lib/scripts/utils/XYMap.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { Random } from '#lib/scripts/utils/random.ts'
import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export class LevelInstance {
	tiles: XYMap<TileDef>
	playerSpawnPosition: XY
	constructor(
		game: Game,
		public levelDef: LevelDef,
		public loops: number,
	) {
		const { spawnPosition, tiles } = TileDef.parseLevelTiles(levelDef, this.loops)
		this.tiles = tiles
		this.playerSpawnPosition = TileDef.toWorldMidpoint(spawnPosition)
	}
	getTreasureSpawnPosition() {
		const treasures = this.tiles.values.filter((t) => t.contents.kind === 'treasureSpawn')
		const xy = Random.chooseOne(treasures)?.tileXY ?? { x: 0, y: 0 }
		return TileDef.toWorldMidpoint(xy)
	}
}
