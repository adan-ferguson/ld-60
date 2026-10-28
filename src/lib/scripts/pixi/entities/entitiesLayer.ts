import { Container } from 'pixi.js'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'

export class EntitiesLayer extends Container {
	onScreen: Map<GameEntity, GameEntityEl> = new Map()
	constructor(private gc: GameController) {
		super()
	}
	update(delta: number) {
		if (!this.gc.game?.playing) {
			return
		}
		for (const entity of this.gc.game.activeEntities) {
			if (!this.onScreen.has(entity)) {
				const pixiEl = entity.createPixiEl(this.gc)
				this.onScreen.set(entity, pixiEl)
				this.addChild(pixiEl)
			} else {
				this.onScreen.get(entity)!.update(delta)
			}
		}
		for (const [entity, pixiEl] of this.onScreen) {
			if (!this.gc.game.activeEntities.includes(entity)) {
				this.removeChild(pixiEl)
				pixiEl.destroy()
				this.onScreen.delete(entity)
			}
		}
	}

	clear() {
		for (const pixiEl of [...this.children]) {
			this.removeChild(pixiEl)
			pixiEl.destroy()
		}
		this.onScreen.clear()
	}
}
