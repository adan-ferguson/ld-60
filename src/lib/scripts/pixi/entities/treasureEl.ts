import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Treasure } from '#lib/scripts/game/treasure.ts'
import { Assets, Sprite } from 'pixi.js'

AssetUtils.requestPreload({
	src: `/assets/sprites/treasure.png`,
	alias: `treasure`,
})

export class TreasureEl extends GameEntityEl {
	constructor(gc: GameController, treasure: Treasure) {
		super(gc, treasure)
		const sprite = new Sprite({
			texture: Assets.get('treasure'),
			anchor: { x: 0.5, y: 0.5 },
		})
		this.addChild(sprite)
	}
}
