import { Container } from 'pixi.js'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export abstract class GameEntityEl extends Container {
	constructor(protected entity: GameEntity) {
		super()
	}
	public update() {
		this.x = this.entity.position.x
		this.y = this.entity.position.y
		this.draw()
	}
	public abstract draw(): void
}
