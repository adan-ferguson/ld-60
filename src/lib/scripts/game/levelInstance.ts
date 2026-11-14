import Game from '#lib/scripts/game/game.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XYMap } from '#lib/scripts/utils/XYMap.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { Random } from '#lib/scripts/utils/random.ts'
import type { LevelDef } from '#lib/scripts/game/levelDef.ts'
import { Phanta } from '#lib/scripts/game/entities/phanta.ts'
import { Treasure } from '#lib/scripts/game/treasure.ts'
import { EntitiesManager } from '#lib/scripts/game/entitiesManager.ts'
import { WorldCollision } from '#lib/scripts/game/collisions/worldCollision.ts'
import { Player } from '#lib/scripts/game/player/player.ts'
import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { MusicPlayer, type SongName } from '#lib/scripts/audio/musicPlayer.ts'

export class LevelInstance {
	entitiesManager: EntitiesManager
	tiles: XYMap<TileDef>
	player: Player
	worldCollision: WorldCollision
	roundTimer = new CoolCounter()
	running = false
	#cleared = false
	#playerSpawnPosition: XY
	waveCleared = CoolEvents.createHandler()
	collectedTreasure = false
	#stopped = false
	constructor(
		public game: Game,
		public levelDef: LevelDef,
		public wave: number,
	) {
		const { spawnPosition, tiles } = TileDef.parseLevelTiles(levelDef, this.loops)
		this.tiles = tiles
		this.player = new Player(this, spawnPosition)
		this.#playerSpawnPosition = this.player.xy
		this.entitiesManager = new EntitiesManager(this)
		this.worldCollision = new WorldCollision(this)

		this.roundTimer.addThreshold(this.#treasureSpawnTime, () => this.#spawnTreasure())
		if (this.#phantaSpawnTime) {
			this.roundTimer.addThreshold(this.#phantaSpawnTime, () => this.#spawnPhanta())
		}
		this.roundTimer.addInterval(this.#turretShotInterval, () =>
			this.entitiesManager.fireRandomTurret(),
		)
	}
	get hasPrincess() {
		return this.levelDef.hasPrincess
	}
	get loops() {
		return Math.ceil(this.wave / 10)
	}
	get song(): SongName {
		if (this.wave % 10 === 0) {
			return 'bossfight'
		}
		const index = ((this.wave - 1) % 10) % 3
		if (index === 0) {
			return `level1`
		}
		if (index === 1) {
			return `level2`
		}
		return `level3`
	}
	get #treasureSpawnTime() {
		return getLoopedVal(this.levelDef.treasureSpawnTime ?? 5, this.loops)
	}
	get #phantaSpawnTime() {
		return getLoopedVal(this.levelDef.phantaSpawnTime ?? [30, 25, 20], this.loops)
	}
	get #turretShotInterval() {
		return getLoopedVal(this.levelDef.turretShotTime ?? [4, 3.5, 3], this.loops)
	}
	begin() {
		this.running = true
		// other stuff?
	}
	end() {
		this.running = false
		// other stuff?
	}
	update(delta: number) {
		if (!this.running || this.#stopped) {
			return
		}
		this.entitiesManager.update(delta)
		this.player.update(delta)
		this.roundTimer.value += delta
		if (!this.#cleared) {
			if (this.hasPrincess) {
				return
			} else if (!this.entitiesManager.hasEnemy) {
				this.#cleared = true
				this.waveCleared.emit()
			}
		}
	}
	tilesOfKind(...kinds: string[]) {
		return this.tiles.values.filter((t) => kinds.includes(t.contents.kind))
	}
	#spawnPhanta() {
		if (this.player.isDestroyed || this.#cleared) {
			return
		}
		this.entitiesManager.spawn(new Phanta(this, this.#playerSpawnPosition))
		MusicPlayer.play('hurry')
		setTimeout(() => {
			MusicPlayer.play(this.song, true)
		}, 1000)
	}
	#spawnTreasure() {
		const treasures = this.tiles.values.filter((t) => t.contents.kind === 'treasureSpawn')
		const xy = Random.chooseOne(treasures)?.tileXY ?? { x: 0, y: 0 }
		this.entitiesManager.spawn(new Treasure(this, TileDef.toWorldMidpoint(xy)))
	}

	princessRescued() {
		if (!this.#cleared) {
			this.#cleared = true
			this.#stopped = true
			this.waveCleared.emit()
		}
	}
}

function getLoopedVal(param: [number, number, number] | number, loop: number) {
	if (typeof param === 'number') {
		return param
	}
	return param[loop - 1] ?? param[0] ?? 0
}
