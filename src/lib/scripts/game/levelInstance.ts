import Game from '#lib/scripts/game/game.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import type { XYMap } from '#lib/scripts/utils/XYMap.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { TerrainCollision } from '#lib/scripts/game/terrainCollision.ts'
import type { EnemySpawnDef } from '#lib/scripts/game/enemies/enemy.ts'
import { Random } from '#lib/scripts/utils/random.ts'

export class LevelInstance {
	tiles: XYMap<TileDef>
	playerSpawnPosition: XY
	public terrainCollision: TerrainCollision
	constructor(
		game: Game,
		levelDef: LevelDef,
		public loops: number,
	) {
		const { spawnPosition, tiles } = TileDef.parseLevel(levelDef.tiles)
		this.tiles = tiles
		this.playerSpawnPosition = TileDef.toWorldXY(spawnPosition)
		this.terrainCollision = new TerrainCollision(tiles)
	}
	get enemySpawns() {
		const enemySpawns: EnemySpawnDef[] = []
		const addMaybe = (loop: number, type: 'turret' | 'man', xy: XY) => {
			if (this.loops < loop) {
				return
			}
			enemySpawns.push({
				tileXY: xy,
				enemyType: type,
			})
		}
		for (const tileDef of this.tiles.values) {
			const xy = tileDef.tileXY
			if (tileDef.type == 'turret1') {
				addMaybe(1, 'turret', xy)
			} else if (tileDef.type == 'turret2') {
				addMaybe(2, 'turret', xy)
			} else if (tileDef.type == 'turret3') {
				addMaybe(3, 'turret', xy)
			} else if (tileDef.type == 'man1') {
				addMaybe(1, 'man', xy)
			} else if (tileDef.type == 'man2') {
				addMaybe(2, 'man', xy)
			} else if (tileDef.type == 'man3') {
				addMaybe(3, 'man', xy)
			}
		}
		return enemySpawns
	}
	getTreasureSpawnPosition() {
		const treasures = this.tiles.values.filter((t) => t.type === 'treasure')
		const xy = Random.chooseOne(treasures)?.tileXY ?? { x: 0, y: 0 }
		return TileDef.toWorldXY(xy)
	}
}
