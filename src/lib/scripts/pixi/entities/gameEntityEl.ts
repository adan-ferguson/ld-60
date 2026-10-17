import { Container } from 'pixi.js'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export abstract class GameEntityEl extends Container {
	constructor(protected entity: GameEntity) {
		super()
	}
	public update() {
		this.x = Math.round(this.entity.x)
		this.y = Math.round(this.entity.y)
		this.draw()
	}
	public abstract draw(): void
}
