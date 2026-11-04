import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { PhantaEl } from '#lib/scripts/pixi/entities/phantaEl.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

const SPAWN_TIME = 1.5

const INITIAL_SPEED = 1
const ACCEL = 0.8
const ACCEL_ACCEL = 0.1
const HIT_SPEED_REDUCTION = 0.7

const FLY_AWAY_BASE_SPEED = 10
const FLY_AWAY_ACCEL = 10

export class Phanta extends GameEntity {
	flyingAway = false
	#speed: number
	events = CoolEvents.map({
		flyingAway() {},
		spawned() {},
	})
	get playerOnRight() {
		return this.level.player.x > this.x
	}
	constructor(level: LevelInstance, position: XY) {
		super(level)
		this.isReady = false
		this.xy = position
		this.#speed = INITIAL_SPEED
		level.waveCleared.listen(() => {
			this.flyingAway = true
			this.#speed = FLY_AWAY_BASE_SPEED
			this.events.flyingAway.emit()
		})
	}

	override get canBeHitByPlayer() {
		return true
	}

	get isHazard() {
		return !this.flyingAway
	}

	get w(): number {
		return 4
	}

	get h(): number {
		return 4
	}

	override update2(delta: number): void {
		if (this.time < SPAWN_TIME) {
			return
		}
		if (!this.isReady) {
			this.isReady = true
			this.events.spawned.emit()
		}
		const angleToPlayer = Math.atan2(this.level.player.y - this.y, this.level.player.x - this.x)
		if (this.flyingAway) {
			this.#speed += FLY_AWAY_ACCEL * delta
			this.x += this.#speed * delta * Math.cos(angleToPlayer) * -1
			this.y += this.#speed * delta * Math.sin(angleToPlayer) * -1
		} else {
			this.#speed += delta * (ACCEL + ACCEL_ACCEL * this.time)
			this.x += this.#speed * delta * Math.cos(angleToPlayer)
			this.y += this.#speed * delta * Math.sin(angleToPlayer)
		}
	}

	override takeDamage() {
		this.#speed *= HIT_SPEED_REDUCTION
	}

	createPixiEl(gc: GameController): GameEntityEl {
		return new PhantaEl(gc, this)
	}
}
