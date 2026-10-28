import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { TurretEl } from '#lib/scripts/pixi/entities/turretEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'

export class Turret extends Enemy {
	public fireTimeout: number | undefined
	public update2(delta: number): void {
		if (this.fireTimeout === undefined) {
			return
		}
		this.fireTimeout -= delta
		if (this.fireTimeout <= 0) {
			this.fire()
			this.fireTimeout = undefined
		}
	}
	public createPixiEl(gc: GameController): GameEntityEl {
		return new TurretEl(gc, this)
	}
	public get w(): number {
		return 8
	}
	public get h(): number {
		return 8
	}
	get score(): number {
		return 1000
	}
	constructor(game: Game, tileXY: XY) {
		super(game, tileXY)
	}
	queueFire() {
		if (this.fireTimeout !== undefined) {
			this.fire()
		}
		this.fireTimeout = 1
	}
	private fire() {
		if (!this.game.player?.isActive) {
			return
		}
		const angle = this.angleTo(this.game.player)
		const SPEED = 60
		this.game.entitiesManager.spawn(
			new Projectile(this.game, {
				style: 'dot',
				w: 2,
				h: 2,
				source: 'enemy',
				lifetime: 10,
				velX: Math.cos(angle) * SPEED,
				velY: Math.sin(angle) * SPEED,
				x: this.x,
				y: this.y,
				angle: angle,
				tint: 'red',
			}),
		)
	}
}
