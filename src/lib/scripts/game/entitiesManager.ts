import Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { createEnemy } from '#lib/scripts/game/enemies/enemyFactory.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'

export class EntitiesManager {
	public entities: Set<GameEntity> = new Set()
	constructor(private game: Game) {}
	get enemies() {
		return this.entities.values().filter((e) => e instanceof Enemy)
	}
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

	setLevel(level: LevelInstance) {
		this.entities.clear()
		level.enemySpawns.forEach((enemySpawnData) => {
			this.entities.add(createEnemy(this.game, enemySpawnData))
		})
	}

	fireRandomTurret() {}
}
