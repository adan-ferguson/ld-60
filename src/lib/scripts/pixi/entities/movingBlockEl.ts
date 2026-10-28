import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'
import { Graphics } from 'pixi.js'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

AssetUtils.requestPreload({
	src: `/assets/sprites/spike.png`,
	alias: `spike`,
})

export class MovingBlockEl extends GameEntityEl {
	constructor(
		gc: GameController,
		private block: MovingBlock,
	) {
		super(gc, block)
		const gfx = new Graphics()
		this.addChild(gfx)
		gfx
			.roundRect(-this.block.w / 2, -this.block.h / 2, this.block.w, this.block.h, 1)
			.fill(block.type === 'block' ? 'white' : 'red')
	}
}
