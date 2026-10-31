import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { type ManAnimationType, ManEl } from '#lib/scripts/pixi/entities/manEl.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import { isSquished } from '#lib/scripts/game/collisions/isSquished.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'

export type ManProps = {
	facing: 1 | -1
	health: number
}

export abstract class Man extends Enemy {
	public animationChanged = CoolEvents.createHandler<(type: ManAnimationType) => void>()
	protected constructor(game: Game, tileXY: XY, props: Partial<ManProps>) {
		super(game, tileXY)
		const p: ManProps = {
			facing: 1,
			health: 1,
			...props,
		}
		this.facing = p.facing
		this.#maxHealth = p.health
		this.y -= 2
	}
	readonly #maxHealth: number
	abstract get defaultAnimation(): ManAnimationType
	override get h(): number {
		return 12
	}
	override get w(): number {
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
	override get maxHealth(): number {
		return this.#maxHealth
	}
	createPixiEl(gc: GameController): GameEntityEl {
		return new ManEl(gc, this)
	}
	protected override move(delta: number) {
		const result = this.game.worldCollision.resolveMovement(this.worldBounds, this.velX * delta, 0)
		this.x += result.x - this.worldBounds.x
		if (result.horizontalSolids.length > 0) {
			this.facing *= -1
		}
	}

	public fire() {
		this.game.entitiesManager.spawn(
			new Projectile(this.game, {
				style: 'small',
				w: 4,
				h: 1,
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

	private checkSquish(): boolean {
		const solids = this.game.worldCollision.movementBlockers.map((s) => s.rect)
		if (!isSquished(this.worldBounds, solids)) {
			return false
		}
		this.takeDamage(this.maxHealth)
		return true
	}
}
