import { Man, type ManProps } from '#lib/scripts/game/entities/man.ts'
import type { ManAnimationType } from '#lib/scripts/pixi/entities/manEl.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { GenericState } from '#lib/scripts/game/genericState.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import type { ColorSource } from 'pixi.js'

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
	get color(): ColorSource {
		return 'red'
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
	fire() {
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
