import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type { MovingBlockDef } from '#lib/scripts/game/levelDef.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { MovingBlockEl } from '#lib/scripts/pixi/entities/movingBlockEl.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import { Cardinal } from '#lib/scripts/utils/cardinal.ts'

const DEFAULT_SPEED = 20

export class MovingBlock extends GameEntity {
	private min: number
	private max: number
	private dir: -1 | 1
	public createPixiEl(gc: GameController): GameEntityEl {
		return new MovingBlockEl(gc, this)
	}
	public get axis() {
		return this.cardinal.axis
	}
	public get cardinal() {
		return Cardinal.fromAxis(this.def.isX)
	}
	public get w(): number {
		return Consts.TILE_SIZE_PX
	}
	public get h(): number {
		return Consts.TILE_SIZE_PX
	}
	public get type() {
		return this.def.type ?? 'block'
	}
	public override get blocksMovement() {
		return this.type === 'block'
	}
	public override get blocksProjectiles() {
		return this.type === 'block'
	}
	public override get isHazard() {
		return this.type === 'spike'
	}
	constructor(
		game: Game,
		tileXY: XY,
		private def: MovingBlockDef,
	) {
		super(game)
		this.setTileXY(tileXY)
		const toWorld = (val: number) => TileDef.toWorld(val) + Consts.TILE_SIZE_PX / 2
		if (def.range) {
			this.min = toWorld(tileXY[this.axis] + def.range[0])
			this.max = toWorld(tileXY[this.axis] + def.range[1])
		} else {
			const { min, max } = this.autoCalcRange(tileXY)
			this.min = toWorld(min)
			this.max = toWorld(max)
		}
		this.dir = def.initialDir ?? 1
	}
	private get current() {
		return this[this.axis]
	}
	public update2(delta: number): void {
		this.velX = 0
		this.velY = 0
		const speed = this.def.speed ?? DEFAULT_SPEED
		const distance = this.dir === 1 ? this.max - this.current : this.current - this.min
		if (distance <= 0) {
			this.dir = this.dir === 1 ? -1 : 1
			return
		}

		const velocity = this.dir * Math.min(speed, distance / delta)

		if (this.axis === 'x') {
			this.velX = velocity
		} else {
			this.velY = velocity
		}

		if (Math.abs(velocity * delta) >= distance) {
			this.dir = this.dir === 1 ? -1 : 1
		}
	}
	override move(delta: number) {
		const previousBounds = this.worldBounds.midpoint
		const riders = this.getEntitiesStandingOn()
		super.move(delta)
		const deltaX = this.x - previousBounds.x
		const deltaY = this.y - previousBounds.y
		for (const rider of riders) {
			rider.x += deltaX
			rider.y += deltaY
		}
	}

	private getEntitiesStandingOn() {
		return this.game.entitiesManager.activeEntities.filter((e) => {
			if (!e.canStand) {
				return
			}
			const solids = this.game.worldCollision.getGround(e.worldBounds)
			if (!solids.some((s) => s.entity === this)) {
				return false
			}
			if (this.velY < 0) {
				return true
			} else if (this.velY > 0 && solids.length === 1) {
				return true // If false, block is moving down but the player stays back
			} else {
				const overlap = e.worldBounds.overlap(this.worldBounds)
				return overlap && overlap.width > e.worldBounds.width / 2
			}
		})
	}

	private autoCalcRange(tileXY: XY): { min: number; max: number } {
		const terrainXYs = this.game.level.terrainTiles.map((t) => t.tileXY)
		const blockAdjacentPosition = tileXY[this.cardinal.adjacentAxis]

		const relevantTerrain = terrainXYs.filter((tile) => {
			return tile[this.cardinal.adjacentAxis] === blockAdjacentPosition
		})

		const terrainPositions = relevantTerrain.map((tile) => tile[this.axis])

		const negativePositions = terrainPositions.filter((position) => position < tileXY[this.axis])
		const positivePositions = terrainPositions.filter((position) => position > tileXY[this.axis])

		const negativeWall = Math.max(...negativePositions)
		const positiveWall = Math.min(...positivePositions)

		if (!Number.isFinite(negativeWall) || !Number.isFinite(positiveWall)) {
			throw new Error(`Could not calculate moving block range at (${tileXY.x}, ${tileXY.y})`)
		}

		return {
			min: negativeWall + 1,
			max: positiveWall - 1,
		}
	}
}
