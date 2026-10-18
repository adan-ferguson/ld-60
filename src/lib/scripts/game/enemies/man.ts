import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { ManEl } from '#lib/scripts/pixi/entities/manEl.ts'

export class Man extends Enemy {
	get score(): number {
		return 1000
	}
	public get maxHealth(): number {
		return 1
	}
	constructor(game: Game, tileXY: XY) {
		super(game, tileXY)
		this.y -= 2
	}
	createPixiEl(gc: GameController): GameEntityEl {
		return new ManEl(gc, this)
	}
	get height(): number {
		return 12
	}
	update2(delta: number): void {
		if (this.worldBounds.intersects(this.game.player.hurtboxBounds)) {
			this.game.player.takeDamage(1)
		}
	}
	get width(): number {
		return 8
	}
}
