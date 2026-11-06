import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { ConditionalBlockEl } from '#lib/scripts/pixi/entities/conditionalBlockEl.ts'
import { Consts } from '#lib/scripts/consts.ts'
import type { ConditionalBlockDef } from '#lib/scripts/game/levelDef.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { BossMan } from '#lib/scripts/game/entities/bossMan.ts'

export class ConditionalBlock extends GameEntity {
	constructor(
		level: LevelInstance,
		private def: ConditionalBlockDef,
	) {
		super(level)
		this.isReady = false
	}

	get baseHeight(): number {
		return Consts.TILE_SIZE_PX
	}

	get baseWidth(): number {
		return Consts.TILE_SIZE_PX
	}

	override get blocksMovement() {
		return true // TODO: test that this doesn't work until isReady is true
	}

	override get blocksProjectiles() {
		return true // TODO: test that this doesn't work until isReady is true
	}

	createPixiEl(gc: GameController): GameEntityEl {
		return new ConditionalBlockEl(gc, this)
	}

	update2(): void {
		if (!this.level.entitiesManager.activeEntities.some((e) => e instanceof BossMan)) {
			this.isReady = true
		}
	}
}
