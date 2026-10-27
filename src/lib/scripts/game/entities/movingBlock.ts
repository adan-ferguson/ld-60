import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type { MovingBlockDef } from '#lib/scripts/game/levelDef.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { MovingBlockEl } from '#lib/scripts/pixi/entities/movingBlockEl.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'

const DEFAULT_SPEED = 20

export class MovingBlock extends GameEntity {
	private min: number
	private max: number
	private dir: -1 | 1
	public createPixiEl(gc: GameController): GameEntityEl {
		return new MovingBlockEl(gc, this)
	}
	public get w(): number {
		return Consts.TILE_SIZE_PX
	}
	public get h(): number {
		return Consts.TILE_SIZE_PX
	}
	public override get isSolid() {
		return true
	}
	constructor(
		game: Game,
		tileXY: XY,
		private def: MovingBlockDef,
	) {
		super(game)
		this.setTileXY(tileXY)
		this.min = TileDef.toWorld(tileXY[def.axis] + def.range[0]) + Consts.TILE_SIZE_PX / 2
		this.max = TileDef.toWorld(tileXY[def.axis] + def.range[1]) + Consts.TILE_SIZE_PX / 2
		this.dir = def.initialDir ?? 1
	}
	private get current() {
		return this[this.def.axis]
	}
	private set current(value: number) {
		this[this.def.axis] = value
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

		if (this.def.axis === 'x') {
			this.velX = velocity
		} else {
			this.velY = velocity
		}

		if (Math.abs(velocity * delta) >= distance) {
			this.dir = this.dir === 1 ? -1 : 1
		}
	}
}
