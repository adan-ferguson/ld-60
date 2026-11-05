import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { TurretEl } from '#lib/scripts/pixi/entities/turretEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

export type TurretProps = {
	health: number
}

export class Turret extends Enemy {
	public fireTimeout: number | undefined
	private props: TurretProps
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
	public override get maxHealth() {
		return this.props.health
	}
	get score(): number {
		return 1000
	}
	override get blocksMovement() {
		return true
	}
	constructor(level: LevelInstance, props: Partial<TurretProps>) {
		super(level)
		this.props = {
			health: 1,
			...props,
		}
	}
	queueFire() {
		if (this.fireTimeout !== undefined) {
			this.fire()
		}
		this.fireTimeout = 1
	}
	private fire() {
		if (!this.level.player.isActive) {
			return
		}
		const angle = this.worldBounds.angleTo(this.level.player.worldBounds.getEdge('bottom', 0.66))
		const SPEED = 60
		this.level.entitiesManager.spawn(
			new Projectile(this.level, {
				style: 'dot',
				hitbox: { x: 2, y: 2 },
				wallHitbox: { x: 2, y: 2 },
				source: this,
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
