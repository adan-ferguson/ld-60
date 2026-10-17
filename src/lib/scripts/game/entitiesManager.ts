import type { Game } from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export class EntitiesManager {
	public entities: Set<GameEntity> = new Set()
	constructor(private game: Game) {}
	spawn(entity: GameEntity) {
		this.entities.add(entity)
	}
	update(delta: number) {
		for (const entity of [...this.entities]) {
			if (entity.isActive) {
				entity.update(delta)
			} else {
				this.entities.delete(entity)
			}
		}
	}
}
