import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'
import { Assets, Graphics, Sprite } from 'pixi.js'
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
		if (block.type === 'spike') {
			this.addChild(
				new Sprite({
					texture: Assets.get('spike'),
					anchor: { x: 0.5, y: 0.5 },
				}),
			)
		} else {
			const gfx = new Graphics()
			this.addChild(gfx)
			gfx
				.roundRect(-this.block.w / 2, -this.block.h / 2, this.block.w, this.block.h, 1)
				.fill(block.type === 'block' ? 'white' : 'red')
		}
	}
}
