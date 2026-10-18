import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { TurretEl } from '#lib/scripts/pixi/entities/turretEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'

export class Turret extends Enemy {
	public update2(): void {}
	public createPixiEl(gc: GameController): GameEntityEl {
		return new TurretEl(gc, this)
	}
	public get width(): number {
		return 8
	}
	public get height(): number {
		return 8
	}
	constructor(game: Game, tileXY: XY) {
		super(game, tileXY)
	}
}
