import { Man, type ManProps } from '#lib/scripts/game/entities/man.ts'
import Game from '#lib/scripts/game/game.ts'
import type { ManAnimationType } from '#lib/scripts/pixi/entities/manEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { GenericState } from '#lib/scripts/game/genericState.ts'

const ATTACK_COOLDOWN = 0.8
const ATTACK_WINDUP = 0.72
const ATTACK_DURATION = 1.4

export type ShooterManProps = ManProps

export class ShooterMan extends Man {
	#state: State
	public constructor(level: LevelInstance, props: Partial<ManProps>) {
		super(level, props)
		this.#state = new IdleState(false)
	}
	get defaultAnimation(): ManAnimationType {
		return 'stand'
	}
	public get state(): State {
		return this.#state
	}
	public set state(newState: State) {
		this.#state = newState
		this.animationChanged.emit(newState.animation)
	}
	update2(delta: number): void {
		const { player } = this.level
		if (player && this.worldBounds.pad({ y: -3 }).intersects(player.worldBounds)) {
			player.takeDamage(1)
		}
		this.state.update(this, delta)
	}
}

abstract class State extends GenericState<Man> {
	abstract get animation(): ManAnimationType
}

class IdleState extends State {
	constructor(private attackOnCooldown = true) {
		super()
	}
	get animation(): ManAnimationType {
		return 'stand'
	}
	update2(man: ShooterMan, _delta: number): void {
		if (this.attackOnCooldown && this.time < ATTACK_COOLDOWN) {
			return
		}
		if (man.seesPlayer()) {
			man.state = new AttackWindupState()
		}
	}
}

class AttackWindupState extends State {
	get animation(): ManAnimationType {
		return 'attackWindup'
	}
	update2(man: ShooterMan, _delta: number): void {
		if (this.time >= ATTACK_WINDUP) {
			man.fire()
			man.state = new AttackState()
		}
	}
}

class AttackState extends State {
	get animation(): ManAnimationType {
		return 'attack'
	}
	update2(man: ShooterMan, _delta: number): void {
		if (this.time >= ATTACK_DURATION) {
			man.state = new IdleState()
		}
	}
}
