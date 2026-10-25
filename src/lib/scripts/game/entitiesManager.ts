import Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import { Turret } from '#lib/scripts/game/entities/turret.ts'
import { Random } from '#lib/scripts/utils/random.ts'
import type { TileDef } from '#lib/scripts/game/tileDef.ts'
import { Man } from '#lib/scripts/game/entities/man.ts'
import { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'

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
		this.game.level?.tiles.values.forEach((tileDef) => {
			const entity = tryCreateEntity(this.game, tileDef)
			if (entity) {
				this.entities.add(entity)
			}
		})
	}

	fireRandomTurret() {
		const turrets = [...this.entities].filter((e) => e instanceof Turret)
		const turret =
			Random.chooseOne(turrets.filter((t) => !t.fireTimeout)) ?? Random.chooseOne(turrets)
		turret?.queueFire()
	}
}

export function tryCreateEntity(game: Game, def: TileDef) {
	if (def.contents.kind === 'turret') {
		return new Turret(game, def.tileXY)
	} else if (def.contents.kind === 'man') {
		return new Man(game, def.tileXY, def.contents)
	} else if (def.contents.kind === 'movingBlock') {
		return new MovingBlock(game, def.tileXY, def.contents)
	}
	return false
}
