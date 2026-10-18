import { Container } from 'pixi.js'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'

export abstract class GameEntityEl extends Container {
	constructor(
		protected gc: GameController,
		protected entity: GameEntity,
	) {
		super()
		this.zIndex = 0
	}
	public update() {
		this.x = Math.round(this.entity.x)
		this.y = Math.round(this.entity.y)
		this.draw()
	}
	public draw() {}
}
