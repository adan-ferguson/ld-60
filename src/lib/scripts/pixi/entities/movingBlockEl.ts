import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'
import { Graphics } from 'pixi.js'

export class MovingBlockEl extends GameEntityEl {
	constructor(
		gc: GameController,
		private block: MovingBlock,
	) {
		super(gc, block)
		const gfx = new Graphics()
		this.addChild(gfx)
		gfx.rect(-this.block.w / 2, -this.block.h / 2, this.block.w, this.block.h).fill('white')
	}
}
