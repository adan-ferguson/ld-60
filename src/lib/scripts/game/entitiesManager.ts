import Game from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import { Turret } from '#lib/scripts/game/entities/turret.ts'
import { Random } from '#lib/scripts/utils/random.ts'
import type { TileDef } from '#lib/scripts/game/tileDef.ts'
import { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'
import { ShooterMan } from '#lib/scripts/game/entities/shooterMan.ts'
import { RunnerMan } from '#lib/scripts/game/entities/runnerMan.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'

export class EntitiesManager {
	private entities: Set<GameEntity> = new Set()
	constructor(private level: LevelInstance) {
		level.tiles.values.forEach((tileDef) => {
			const entity = tryCreateEntity(this.level, tileDef)
			if (entity) {
				this.entities.add(entity)
			}
		})
	}
	get activeEntities(): GameEntity[] {
		return [...this.entities, this.level.player].filter((entity) => entity.isActive)
	}
	get enemies() {
		return [...this.entities].filter((e) => e instanceof Enemy)
	}
	get hasEnemy() {
		for (const entity of this.entities) {
			if (entity instanceof Enemy && entity.isReady) {
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
			if (!entity.isDestroyed) {
				entity.update(delta)
			} else {
				this.entities.delete(entity)
			}
		}
	}

	fireRandomTurret() {
		const turrets = [...this.entities].filter((e) => e instanceof Turret)
		const turret =
			Random.chooseOne(turrets.filter((t) => !t.fireTimeout)) ?? Random.chooseOne(turrets)
		turret?.queueFire()
	}
}

export function tryCreateEntity(level: LevelInstance, def: TileDef) {
	if (def.contents.kind === 'turret') {
		return new Turret(level, def.tileXY, def.contents)
	} else if (def.contents.kind === 'runnerMan') {
		return new RunnerMan(level, def.tileXY, def.contents)
	} else if (def.contents.kind === 'shooterMan') {
		return new ShooterMan(level, def.tileXY, def.contents)
	} else if (def.contents.kind === 'movingBlock') {
		return new MovingBlock(level, def.tileXY, def.contents)
	}
	return false
}
