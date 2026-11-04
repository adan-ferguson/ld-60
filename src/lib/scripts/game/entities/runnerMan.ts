import { Man, type ManProps } from '#lib/scripts/game/entities/man.ts'
import type Game from '#lib/scripts/game/game.ts'
import type { ManAnimationType } from '#lib/scripts/pixi/entities/manEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

export type RunnerManProps = ManProps & {
	speed: number
	sprintBonus: number
}

export class RunnerMan extends Man {
	readonly #speed: number
	readonly #sprintBonus: number
	public constructor(level: LevelInstance, tileXY: XY, props: Partial<RunnerManProps>) {
		super(level, tileXY, props)
		this.#speed = props.speed ?? 25
		this.#sprintBonus = props.sprintBonus ?? 15
	}
	get defaultAnimation(): ManAnimationType {
		return 'run'
	}
	update2(_delta: number): void {
		const { player } = this.level
		if (player && this.worldBounds.pad({ y: -3 }).intersects(player.worldBounds)) {
			player.takeDamage(1)
		}
		if (!this.hasGroundAhead()) {
			this.facing *= -1
		}
		this.velX = this.facing * (this.#speed + (this.seesPlayer() ? this.#sprintBonus : 0))
	}
}
