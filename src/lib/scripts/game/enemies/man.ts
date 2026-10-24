import type { XY } from '#lib/scripts/utils/XY.ts'
import { Enemy } from '#lib/scripts/game/enemies/enemy.ts'
import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { ManEl } from '#lib/scripts/pixi/entities/manEl.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'

const MOVE_SPEED = 14
const LEDGE_LOOKAHEAD = 1
const ATTACK_COOLDOWN = 2.4
const ATTACK_WINDUP = 0.8
const ATTACK_DURATION = 0.4

export type ManBehavior = 'patrol' | 'stand'

export class Man extends Enemy {
	public stateChanged = CoolEvents.createHandler<(state: State) => void>()
	#state: State
	public get state(): State {
		return this.#state
	}
	public set state(newState: State) {
		this.#state = newState
		this.stateChanged.emit(newState)
	}
	protected get height(): number {
		return 12
	}
	protected get width(): number {
		return 8
	}
	get score(): number {
		return 1000
	}
	public get maxHealth(): number {
		return 1
	}
	private attackCooldown = ATTACK_COOLDOWN
	constructor(
		game: Game,
		tileXY: XY,
		public behavior: ManBehavior = 'patrol',
		facing: 1 | -1 = 1,
	) {
		super(game, tileXY)
		this.facing = facing
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
		const result = this.game.level.terrainCollision.resolveMovement(
			this.worldBounds,
			this.velX * delta,
			0,
		)

		this.x += result.x - this.worldBounds.x

		if (result.hitHorizontal) {
			this.facing *= -1
		}
	}
	hasGroundAhead(): boolean {
		const body = this.worldBounds
		const probeWidth = 0.5
		const probeX =
			this.facing > 0
				? body.x + body.width + LEDGE_LOOKAHEAD
				: body.x - probeWidth - LEDGE_LOOKAHEAD
		return this.game.level.terrainCollision.isGrounded({
			x: probeX,
			y: body.y,
			width: probeWidth,
			height: body.height,
		})
	}

	private beginAttack() {}

	public seesPlayer() {
		// TODO
		return false
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
		if (man.behavior === 'patrol') {
			if (!man.hasGroundAhead()) {
				man.facing *= -1
			}
			man.velX = man.facing * MOVE_SPEED * man.game.loops
		}
		if (this.time >= ATTACK_COOLDOWN && man.seesPlayer()) {
			man.state = new AttackWindupState()
		}
	}
}

class AttackWindupState extends State {
	update2(man: Man, _delta: number): void {
		if (this.time >= ATTACK_WINDUP) {
			man.state = new AttackState()
		}
	}
}

class AttackState extends State {
	update2(man: Man, _delta: number): void {
		// TODO spawn projectile
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
