import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Graphics } from 'pixi.js'
import type { ConditionalBlock } from '#lib/scripts/game/entities/conditionalBlock.ts'

export class ConditionalBlockEl extends GameEntityEl {
	private gfx: Graphics | undefined
	constructor(
		gc: GameController,
		private block: ConditionalBlock,
	) {
		super(gc, block)
	}

	update2() {
		if (this.block.isReady && !this.gfx) {
			console.log('ready')
			this.gfx = new Graphics()
				.roundRect(
					-this.block.baseWidth / 2,
					-this.block.baseHeight / 2,
					this.block.baseWidth,
					this.block.baseHeight,
					1,
				)
				.fill('white')
			this.addChild(this.gfx)
		}
	}
}
