import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { type ManAnimationType, ManEl } from '#lib/scripts/pixi/entities/manEl.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

export type ManProps = {
	facing: 1 | -1
	health: number
	scale: number
}

export abstract class Man extends Enemy {
	public animationChanged = CoolEvents.createHandler<(type: ManAnimationType) => void>()
	protected constructor(level: LevelInstance, props: Partial<ManProps> = {}) {
		super(level)
		const p: ManProps = {
			facing: 1,
			health: 1,
			scale: 1,
			...props,
		}
		this.facing = p.facing
		this.scale = p.scale
		this.#maxHealth = p.health
	}
	readonly #maxHealth: number
	abstract get defaultAnimation(): ManAnimationType
	override get baseHeight(): number {
		return 12
	}
	override get baseWidth(): number {
		return 8
	}
	public override get diesToHazards() {
		return true
	}
	override get canStandOnMovingBlocks() {
		return true
	}
	override get score(): number {
		return 500 + 500 * this.#maxHealth
	}
	public override get squishable() {
		return true
	}
	override get maxHealth(): number {
		return this.#maxHealth
	}
	get visionRect(): CoolRect {
		const HEIGHT = 4
		const WIDTH = 84
		return new CoolRect({
			x: this.facing === 1 ? 0 : -WIDTH,
			y: -HEIGHT / 2,
			width: WIDTH,
			height: HEIGHT,
		})
	}
	createPixiEl(gc: GameController): GameEntityEl {
		return new ManEl(gc, this)
	}
	protected override move(delta: number) {
		const result = this.level.worldCollision.resolveMovement(this.worldBounds, this.velX * delta, 0)
		this.x += result.x - this.worldBounds.x
		if (result.horizontalSolids.length > 0) {
			this.facing *= -1
		}
	}

	public fire() {
		this.level.entitiesManager.spawn(
			new Projectile(this.level, {
				style: 'small',
				hitbox: { x: 4, y: 1 },
				wallHitbox: { x: 4, y: 1 },
				source: this,
				lifetime: 10,
				velX: 80 * this.facing,
				velY: 0,
				angle: Math.atan2(0, this.facing),
				x: this.x + 3 * this.facing,
				y: this.y - 1.5,
				tint: 'red',
			}),
		)
	}

	public seesPlayer(): boolean {
		return this.level.player.worldBounds.intersects(this.toWorldBounds(this.visionRect)) ?? false
	}
}
