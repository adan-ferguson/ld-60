import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'
import { Assets, Graphics, Sprite } from 'pixi.js'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

AssetUtils.requestPreload({
	src: `/assets/sprites/spike.png`,
	alias: `spike`,
})

const ROTATION_SPEED = 2.5
const ROTATION_STEP = Math.PI / 4

export class MovingBlockEl extends GameEntityEl {
	private rotationCounter = 0
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
		if (this.block.type === 'spike') {
			this.rotationCounter += delta * ROTATION_SPEED
			this.rotation = Math.round(this.rotationCounter / ROTATION_STEP) * ROTATION_STEP
		}
	}
}
