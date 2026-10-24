import Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { createEnemy } from '#lib/scripts/game/enemies/enemyFactory.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'
import { Turret } from '#lib/scripts/game/enemies/turret.ts'
import { Random } from '#lib/scripts/utils/random.ts'

export class EntitiesManager {
	public entities: Set<GameEntity> = new Set()
	constructor(private game: Game) {}
	get enemies() {
		return [...this.entities].filter((e) => e instanceof Enemy)
	}
	get hasEnemy() {
		for (const entity of this.entities) {
			if (entity instanceof Enemy && entity.isActive) {
				return true
			}
		}

		return false
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

	reset() {
		this.entities.clear()
		this.game.level?.enemySpawns.forEach((tileDef) => {
			this.entities.add(createEnemy(this.game, tileDef))
		})
	}

	fireRandomTurret() {
		const turrets = [...this.entities].filter((e) => e instanceof Turret)
		const turret =
			Random.chooseOne(turrets.filter((t) => !t.fireTimeout)) ?? Random.chooseOne(turrets)
		turret?.queueFire()
	}
}
