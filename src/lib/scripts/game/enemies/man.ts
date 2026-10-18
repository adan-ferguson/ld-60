import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { ManEl } from '#lib/scripts/pixi/entities/manEl.ts'

const MOVE_SPEED = 14
const LEDGE_LOOKAHEAD = 1

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
		if (!this.hasGroundAhead()) {
			this.facing *= -1
		}
		this.velX = this.facing * MOVE_SPEED * this.game.loops
	}
	protected override move(delta: number) {
		const result = this.game.level.terrainCollision.resolveMovement(
			this.worldBounds,
			this.velX * delta,
			0,
		)

		this.x += result.x - this.worldBounds.x

		if (result.hitHorizontal) {
			this.facing *= -1
		}
	}
	get width(): number {
		return 8
	}
	private hasGroundAhead(): boolean {
		const body = this.worldBounds
		const probeWidth = 0.5
		const probeX =
			this.facing > 0
				? body.x + body.width + LEDGE_LOOKAHEAD
				: body.x - probeWidth - LEDGE_LOOKAHEAD
		return this.game.level.terrainCollision.isGrounded({
			x: probeX,
			y: body.y,
			width: probeWidth,
			height: body.height,
		})
	}
}
