import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { TreasureEl } from '#lib/scripts/pixi/entities/treasureEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type Game from '#lib/scripts/game/game.ts'

const DESPAWN_TIME = 10

export class Treasure extends GameEntity {
	private timer = 0

	constructor(game: Game, pos: XY) {
		super(game)
		this.position = pos
	}

	createPixiEl(gc: GameController): GameEntityEl {
		return new TreasureEl(gc, this)
	}

	get height(): number {
		return 7
	}

	update2(delta: number): void {
		this.timer += delta
		if (this.timer > DESPAWN_TIME) {
			this.isActive = false
			this.game.treasureCombo = 0
		}
		if (this.game.player.worldBounds.intersects(this.worldBounds)) {
			this.isActive = false
			this.game.score += 2000 * this.game.treasureCombo
			this.game.treasureCombo += 1
		}
	}

	get width(): number {
		return 7
	}
}
