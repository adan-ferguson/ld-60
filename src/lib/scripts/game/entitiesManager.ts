import Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { createEnemy } from '#lib/scripts/game/enemies/enemyFactory.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'
import { Turret } from '#lib/scripts/game/enemies/turret.ts'
import { Random } from '#lib/scripts/utils/random.ts'

export class EntitiesManager {
	public entities: Set<GameEntity> = new Set()
	private enemyCount = 0
	constructor(private game: Game) {}
	get enemies() {
		return this.entities.values().filter((e) => e instanceof Enemy)
	}
	get hasEnemy() {
		return this.enemyCount > 0
	}
	spawn(entity: GameEntity) {
		this.entities.add(entity)
	}
	update(delta: number) {
		this.enemyCount = 0
		for (const entity of [...this.entities]) {
			if (entity.isActive) {
				entity.update(delta)
				if (entity instanceof Enemy) {
					this.enemyCount++
				}
			} else {
				this.entities.delete(entity)
			}
		}
	}

	reset() {
		this.entities.clear()
		this.game.level?.enemySpawns.forEach((enemySpawnData) => {
			this.entities.add(createEnemy(this.game, enemySpawnData))
		})
	}

	fireRandomTurret() {
		const turrets = [...this.entities].filter((e) => e instanceof Turret)
		const turret =
			Random.chooseOne(turrets.filter((t) => !t.fireTimeout)) ?? Random.chooseOne(turrets)
		turret?.queueFire()
	}
}
