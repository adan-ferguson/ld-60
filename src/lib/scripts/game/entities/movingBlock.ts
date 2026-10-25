import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type { MovingBlockDef } from '#lib/scripts/game/levelDef.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { MovingBlockEl } from '#lib/scripts/pixi/entities/movingBlockEl.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'

export class MovingBlock extends GameEntity {
	public createPixiEl(gc: GameController): GameEntityEl {
		return new MovingBlockEl(gc, this)
	}
	protected get width(): number {
		return Consts.TILE_SIZE_PX
	}
	protected get height(): number {
		return Consts.TILE_SIZE_PX
	}
	constructor(game: Game, tileXY: XY, def: MovingBlockDef) {
		super(game)
		const worldXY = TileDef.toWorldXY(tileXY)
		this.x = worldXY.x
		this.y = worldXY.y
	}
	public update2(delta: number): void {
		throw new Error('Method not implemented.')
	}
}
