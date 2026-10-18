import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'

export class Man extends Enemy {
	get score(): number {
		throw new Error('Method not implemented.')
	}
	constructor(game: Game, tileXY: XY) {
		super(game, tileXY)
	}
	createPixiEl(): GameEntityEl {
		throw new Error('Method not implemented.')
	}
	get height(): number {
		throw new Error('Method not implemented.')
	}
	update2(delta: number): void {
		throw new Error('Method not implemented.')
	}
	get width(): number {
		throw new Error('Method not implemented.')
	}
}
