import { Container, Graphics } from 'pixi.js'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { flatRect } from '#lib/scripts/utils/flatRect.ts'

const DEBUG = true

export abstract class GameEntityEl extends Container {
	private hitbox: Graphics
	constructor(
		protected gc: GameController,
		protected entity: GameEntity,
	) {
		super()
		this.zIndex = 0
		this.addChild((this.hitbox = new Graphics()))
	}
	public update(delta: number) {
		this.x = Math.round(this.entity.x * Consts.RESOLUTION) / Consts.RESOLUTION
		this.y = Math.round(this.entity.y * Consts.RESOLUTION) / Consts.RESOLUTION
		if (DEBUG) {
			this.hitbox
				.clear()
				.rect(...flatRect(this.entity.localBounds))
				.stroke({ color: 0x00ff00, width: 0.25 })
		}
		this.update2(delta)
	}
	public update2(_delta: number) {}
}
