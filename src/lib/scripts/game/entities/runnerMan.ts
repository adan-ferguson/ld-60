import { Man, type ManProps } from '#lib/scripts/game/entities/man.ts'
import type { ManAnimationType } from '#lib/scripts/pixi/entities/manEl.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { ColorSource } from 'pixi.js'

export type RunnerManProps = ManProps & {
	speed: number
	sprintBonus: number
}

export class RunnerMan extends Man {
	readonly #speed: number
	readonly #sprintBonus: number
	public constructor(level: LevelInstance, props: Partial<RunnerManProps>) {
		super(level, props)
		this.#speed = props.speed ?? 25
		this.#sprintBonus = props.sprintBonus ?? 15
	}
	get defaultAnimation(): ManAnimationType {
		return 'run'
	}
	update2(_delta: number): void {
		const { player } = this.level
		if (
			player &&
			this.worldBounds.pad({ y: -3 }).intersects(player.toWorldBounds(player.hazardHurtbox))
		) {
			player.takeDamage(1)
		}
		if (!this.hasGroundAhead()) {
			this.facing *= -1
		}
		this.velX = this.facing * (this.#speed + (this.seesPlayer() ? this.#sprintBonus : 0))
	}
	protected override move(delta: number) {
		const result = this.level.worldCollision.resolveMovement(this.worldBounds, this.velX * delta, 0)
		this.x += result.x - this.worldBounds.x
		if (result.horizontalSolids.length > 0) {
			this.facing *= -1
		}
	}
}
