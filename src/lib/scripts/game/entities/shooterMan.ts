import { Man, type ManProps } from '#lib/scripts/game/entities/man.ts'
import Game from '#lib/scripts/game/game.ts'
import type { ManAnimationType } from '#lib/scripts/pixi/entities/manEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'

const ATTACK_COOLDOWN = 1.0
const ATTACK_WINDUP = 0.72
const ATTACK_DURATION = 0.4

export type ShooterManProps = ManProps

export class ShooterMan extends Man {
	#state: State
	public constructor(game: Game, tileXY: XY, props: Partial<ManProps>) {
		super(game, tileXY, props)
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
	get visionRect(): CoolRect {
		const HEIGHT = 12
		const WIDTH = 72
		return new CoolRect({
			x: this.facing === 1 ? 0 : -WIDTH,
			y: -HEIGHT / 2,
			width: WIDTH,
			height: HEIGHT,
		})
	}
	update2(delta: number): void {
		const { player } = this.game
		if (player && this.worldBounds.pad({ y: -3 }).intersects(player.worldBounds)) {
			player.takeDamage(1)
		}
		this.state.update(this, delta)
	}
	public seesPlayer(): boolean {
		return this.game.player?.worldBounds.intersects(this.toWorldBounds(this.visionRect)) ?? false
	}
}

abstract class State {
	protected time = 0
	constructor() {}
	update(man: Man, delta: number): void {
		this.update2(man, delta)
		this.time += delta
	}
	abstract update2(man: Man, delta: number): void
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
			man.velX = 0
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
