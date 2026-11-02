import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import Game from '#lib/scripts/game/game.ts'

import type { GameController } from '#lib/scripts/gameController.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { PhantaEl } from '#lib/scripts/pixi/entities/phantaEl.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'

const INITIAL_SPEED = 1
const ACCEL = 0.8
const ACCEL_ACCEL = 0.1
const HIT_SPEED_REDUCTION = 0.7

const FLY_AWAY_BASE_SPEED = 10
const FLY_AWAY_ACCEL = 10

export class Phanta extends GameEntity {
	#flyingAway = false
	#speed: number
	flyingAway = CoolEvents.createHandler()
	get playerOnRight() {
		return this.game.player.x > this.x
	}
	constructor(game: Game, position: XY) {
		super(game)
		this.xy = position
		this.#speed = INITIAL_SPEED
	}

	override get canBeHitByPlayer() {
		return true
	}

	get isHazard() {
		return !this.#flyingAway
	}

	get w(): number {
		return 4
	}

	get h(): number {
		return 4
	}

	update2(delta: number): void {
		if (this.game.waveCleared && !this.#flyingAway) {
			this.#flyingAway = true
			this.#speed = FLY_AWAY_BASE_SPEED
			this.flyingAway.emit()
		}
		const angleToPlayer = Math.atan2(this.game.player.y - this.y, this.game.player.x - this.x)
		if (this.#flyingAway) {
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

	override async animateSpawn() {
		// TODO: animate spawn here
		// this.game.vfxManager.addEffect(new SpawnEffect(this.game, this.position))
	}
}
