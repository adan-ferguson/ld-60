import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import { Turret } from '#lib/scripts/game/entities/turret.ts'
import { Random } from '#lib/scripts/utils/random.ts'
import type { TileDef } from '#lib/scripts/game/tileDef.ts'
import { MovingBlock } from '#lib/scripts/game/entities/movingBlock.ts'
import { ShooterMan } from '#lib/scripts/game/entities/shooterMan.ts'
import { RunnerMan } from '#lib/scripts/game/entities/runnerMan.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { BossMan } from '#lib/scripts/game/entities/bossMan.ts'
import { Princess } from '#lib/scripts/game/entities/princess.ts'
import { ConditionalBlock } from '#lib/scripts/game/entities/conditionalBlock.ts'

export class EntitiesManager {
	#spawnedEntities: Set<GameEntity> = new Set()
	constructor(private level: LevelInstance) {
		level.tiles.values.forEach((tileDef) => {
			const entity = tryCreateEntity(this.level, tileDef)
			if (entity) {
				this.#spawnedEntities.add(entity)
			}
		})
	}
	get #entitiesIncludingPlayer() {
		return [...this.#spawnedEntities, this.level.player]
	}
	get activeEntities(): GameEntity[] {
		return this.#entitiesIncludingPlayer.filter((entity) => entity.isActive)
	}

	/**
	 * Should have an associated pixi element, but logically not interacting in terms of collision/damage/etc.
	 * Generally used for spawning effects.
	 * I don't LOVE the setup but...it's fine.
	 */
	get presentEntities(): GameEntity[] {
		return this.#entitiesIncludingPlayer.filter((entity) => !entity.isDestroyed)
	}
	get enemies() {
		return [...this.#spawnedEntities].filter((e) => e instanceof Enemy)
	}
	get hasEnemy() {
		for (const entity of this.#spawnedEntities) {
			if (entity instanceof Enemy && entity.isReady) {
				return true
			}
		}
		return false
	}
	get hasPrincess() {
		return this.presentEntities.some((e) => e instanceof Princess)
	}
	spawn(entity: GameEntity) {
		this.#spawnedEntities.add(entity)
	}
	update(delta: number) {
		for (const entity of [...this.#spawnedEntities]) {
			if (!entity.isDestroyed) {
				entity.update(delta)
			} else {
				this.#spawnedEntities.delete(entity)
			}
		}
	}

	fireRandomTurret() {
		const turrets = [...this.#spawnedEntities].filter((e) => e instanceof Turret)
		const turret =
			Random.chooseOne(turrets.filter((t) => !t.fireTimeout)) ?? Random.chooseOne(turrets)
		turret?.queueFire()
	}
}

export function tryCreateEntity(level: LevelInstance, def: TileDef) {
	const entity = create()
	if (entity) {
		entity.setTileXY(def.tileXY)
		return entity
	}
	return false
	function create() {
		if (def.contents.kind === 'turret') {
			return new Turret(level, def.contents)
		} else if (def.contents.kind === 'runnerMan') {
			return new RunnerMan(level, def.contents)
		} else if (def.contents.kind === 'shooterMan') {
			return new ShooterMan(level, def.contents)
		} else if (def.contents.kind === 'movingBlock') {
			return new MovingBlock(level, def.contents)
		} else if (def.contents.kind === 'bossMan') {
			return new BossMan(level)
		} else if (def.contents.kind === 'princess') {
			return new Princess(level)
		} else if (def.contents.kind === 'conditionalBlock') {
			return new ConditionalBlock(level, def.contents)
		}
	}
}
