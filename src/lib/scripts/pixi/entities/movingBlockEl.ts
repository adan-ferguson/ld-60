import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'

export class MovingBlockEl extends GameEntityEl {
	constructor(gc: GameController, block: MovingBlock) {
		super(gc, block)
	}
}
