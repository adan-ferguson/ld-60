import { Container } from 'pixi.js'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Consts } from '#lib/scripts/consts.ts'

export abstract class GameEntityEl extends Container {
	constructor(
		protected gc: GameController,
		protected entity: GameEntity,
	) {
		super()
		this.zIndex = 0
	}
	public update() {
		this.x = Math.round(this.entity.x * Consts.RESOLUTION) / Consts.RESOLUTION
		this.y = Math.round(this.entity.y * Consts.RESOLUTION) / Consts.RESOLUTION
		this.draw()
	}
	public draw() {}
}
