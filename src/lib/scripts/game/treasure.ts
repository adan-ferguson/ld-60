import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { TreasureEl } from '#lib/scripts/pixi/entities/treasureEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

const DESPAWN_TIME = 10

export class Treasure extends GameEntity {
	private timer = 0

	constructor(level: LevelInstance, pos: XY) {
		super(level)
		this.xy = pos
	}

	createPixiEl(gc: GameController): GameEntityEl {
		return new TreasureEl(gc, this)
	}

	get baseHeight(): number {
		return 7
	}

	update2(delta: number): void {
		this.timer += delta
		if (this.timer > DESPAWN_TIME) {
			this.destroy('lifetime')
		}
		if (this.level.player.worldBounds.intersects(this.worldBounds)) {
			this.destroy('collected')
			this.level.collectedTreasure = true
		}
	}

	get baseWidth(): number {
		return 7
	}
}
