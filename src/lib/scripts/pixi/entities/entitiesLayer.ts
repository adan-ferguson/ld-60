import { Container } from 'pixi.js'
import type { Game } from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'

export class EntitiesLayer extends Container {
	onScreen: Map<GameEntity, GameEntityEl> = new Map()
	constructor(private game: Game) {
		super()
	}
	update() {
		for (const entity of this.game.activeEntites) {
			if (!this.onScreen.has(entity)) {
				const pixiEl = entity.createPixiEl()
				this.onScreen.set(entity, pixiEl)
				this.addChild(pixiEl)
			} else {
				this.onScreen.get(entity)!.update()
			}
		}
		for (const [entity, pixiEl] of this.onScreen) {
			if (!entity.isActive) {
				this.removeChild(pixiEl)
				pixiEl.destroy()
				this.onScreen.delete(entity)
			}
		}
	}
}
