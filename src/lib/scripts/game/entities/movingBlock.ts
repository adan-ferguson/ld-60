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
	public get width(): number {
		return Consts.TILE_SIZE_PX
	}
	public get height(): number {
		return Consts.TILE_SIZE_PX
	}
	constructor(
		game: Game,
		tileXY: XY,
		private def: MovingBlockDef,
	) {
		super(game)
		const worldXY = TileDef.toWorldXY(tileXY)
		this.x = worldXY.x
		this.y = worldXY.y
		this.min = TileDef.toWorld(tileXY[def.axis] + def.range[0])
		this.max = TileDef.toWorld(tileXY[def.axis] + def.range[1])
		this.dir = def.initialDir ?? 1
	}
	private get current() {
		return this[this.def.axis]
	}
	private set current(value: number) {
		this[this.def.axis] = value
	}
	public update2(delta: number): void {
		const vel = (this.def.speed ?? DEFAULT_SPEED) * delta
		if (this.dir === 1) {
			this.current = Math.min(this.max, this.current + vel)
			if (this.current >= this.max) {
				this.dir = -1
			}
		} else {
			this.current = Math.max(this.min, this.current - vel)
			if (this.current <= this.min) {
				this.dir = 1
			}
		}
	}
}
