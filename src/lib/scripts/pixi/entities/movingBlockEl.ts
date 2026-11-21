import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'
import { Assets, Graphics, Sprite } from 'pixi.js'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import { SpikesRotatingSprite } from '#lib/scripts/pixi/entities/spikesEl.ts'

AssetUtils.requestPreload({
	src: `/assets/sprites/spike.png`,
	alias: `spike`,
})

export class MovingBlockEl extends GameEntityEl {
	private rotationCounter = 0
	#sprite: SpikesRotatingSprite | undefined
	constructor(
		gc: GameController,
		private block: MovingBlock,
	) {
		super(gc, block)
		if (block.type === 'spike') {
			this.#sprite = new SpikesRotatingSprite()
			this.addChild(this.#sprite)
		} else {
			const gfx = new Graphics()
			this.addChild(gfx)
			gfx
				.roundRect(
					-this.block.baseWidth / 2,
					-this.block.baseHeight / 2,
					this.block.baseWidth,
					this.block.baseHeight,
					1,
				)
				.fill(block.type === 'block' ? 'white' : 'red')
		}
	}
	override update2(delta: number): void {
		super.update2(delta)
		this.#sprite?.update(delta)
	}
}
