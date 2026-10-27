import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { ManEl } from '#lib/scripts/pixi/entities/manEl.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { Rectangle } from 'pixi.js'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'

const MOVE_SPEED = 14
const ATTACK_COOLDOWN = 1.4
const ATTACK_WINDUP = 0.6
const ATTACK_DURATION = 0.4

export type ManBehavior = 'patrol' | 'stand'

export type ManProps = {
	facing: 1 | -1
	behavior: ManBehavior
	maxHealth: number
}

export class Man extends Enemy {
	public stateChanged = CoolEvents.createHandler<(state: State) => void>()
	#state: State
	props: ManProps
	public get state(): State {
		return this.#state
	}
	public set state(newState: State) {
		this.#state = newState
		this.stateChanged.emit(newState)
	}
	public get h(): number {
		return 12
	}
	public get w(): number {
		return 8
	}
	get score(): number {
		return 1000 * this.props.maxHealth
	}
	public get maxHealth(): number {
		return this.props.maxHealth
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
	constructor(game: Game, tileXY: XY, props: Partial<ManProps>) {
		super(game, tileXY)
		this.props = {
			maxHealth: 1,
			facing: 1,
			behavior: 'patrol',
			...props,
		}
		this.facing = this.props.facing
		this.y -= 2
		this.#state = new IdleState()
	}
	createPixiEl(gc: GameController): GameEntityEl {
		return new ManEl(gc, this)
	}
	update2(delta: number): void {
		if (this.worldBounds.intersects(this.game.player.worldBounds)) {
			this.game.player.takeDamage(1)
		}
		this.state.update(this, delta)
	}
	protected override move(delta: number) {
		const result = this.game.worldCollision.resolveMovement(this.worldBounds, this.velX * delta, 0)
		this.x += result.x - this.worldBounds.x
		if (result.hitHorizontal) {
			this.facing *= -1
		}
	}
	hasGroundAhead(): boolean {
		const body = this.worldBounds
		const LEDGE_LOOKAHEAD = -1.5
		const x = this.facing > 0 ? body.right + LEDGE_LOOKAHEAD : body.x - LEDGE_LOOKAHEAD
		return this.game.worldCollision.isGrounded(
			new CoolRect({
				x,
				y: body.y,
				width: 0.1,
				height: body.height,
			}),
		)
	}

	public fire() {
		this.game.entitiesManager.spawn(
			new Projectile(this.game, {
				style: 'small',
				w: 4,
				h: 1,
				source: 'enemy',
				lifetime: 10,
				velX: 80 * this.facing,
				velY: 0,
				angle: Math.atan2(0, this.facing),
				x: this.x + 3 * this.facing,
				y: this.y - 2,
				tint: 'red',
			}),
		)
	}

	public seesPlayer() {
		return this.game.player.worldBounds.intersects(this.toWorldBounds(this.visionRect))
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
}

class IdleState extends State {
	update2(man: Man, _delta: number): void {
		if (man.props.behavior === 'patrol') {
			if (!man.hasGroundAhead()) {
				man.facing *= -1
			}
			man.velX = man.facing * MOVE_SPEED * man.game.loops
		} else {
			man.velX = 0
		}
		if (this.time >= ATTACK_COOLDOWN && man.seesPlayer()) {
			man.velX = 0
			man.state = new AttackWindupState()
		}
	}
}

class AttackWindupState extends State {
	update2(man: Man, _delta: number): void {
		if (this.time >= ATTACK_WINDUP) {
			man.fire()
			man.state = new AttackState()
		}
	}
}

class AttackState extends State {
	update2(man: Man, _delta: number): void {
		if (this.time >= ATTACK_DURATION) {
			man.state = new IdleState()
		}
	}
}

export const ManStateTypes = {
	Idle: IdleState,
	AttackWindup: AttackWindupState,
	Attack: AttackState,
}
