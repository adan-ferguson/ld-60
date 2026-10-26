import Game from '#lib/scripts/game/game.ts'
import { ControlsManager } from '#lib/scripts/game/player/controlsManager.ts'
import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { PlayerEl } from '#lib/scripts/pixi/entities/playerEl.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'

export type AerialState =
	| {
			kind: 'grounded'
			time: number
	  }
	| {
			kind: 'aerial'
			doubleJumpUsed: boolean
			time: number
	  }

const JUMP_VELOCITY = 65
const X_VELOCITY = 36
const GRAVITY = 125
const MAX_FALL_SPEED = 200
const WIDTH = 7.5
const HEIGHT = 12
const CROUCH_DIFF = 4
const SHOT_COOLDOWN = 0.21
const AIR_CONTROL = 0.04

export class Player extends GameEntity {
	static COYOTE_TIME = 0.07
	aerialState: AerialState = { kind: 'grounded', time: 0 }
	private controlsManager: ControlsManager
	public jumped =
		CoolEvents.createHandler<(stateBefore: AerialState, stateAfter: AerialState) => void>()
	lastShotTime = 0
	crouching: boolean = false
	public shotFired = CoolEvents.createHandler()
	constructor(game: Game) {
		super(game)
		this.controlsManager = new ControlsManager(this)
	}
	get canShoot() {
		return this.time - this.lastShotTime >= SHOT_COOLDOWN
	}
	public get width(): number {
		return WIDTH
	}
	public get height(): number {
		return this.crouching ? HEIGHT - CROUCH_DIFF : HEIGHT
	}
	crouch() {
		if (this.crouching) {
			return
		}
		this.y += CROUCH_DIFF / 2
		this.crouching = true
	}
	/**
	 * Returns false if we are crouching and there's not enough room to uncrouch.
	 */
	tryUncrouch() {
		if (!this.crouching) {
			return true
		}
		if (!this.roomToUncrouch()) {
			return false
		}
		this.y -= CROUCH_DIFF / 2
		this.crouching = false
		return true
	}
	update2(delta: number) {
		this.pushOutOfSolids()
		this.aerialState.time += delta
		if (!this.onGround()) {
			this.tryUncrouch()
			this.velY += GRAVITY * delta
			this.velY = Math.min(this.velY, MAX_FALL_SPEED)
			if (this.aerialState.kind === 'grounded') {
				this.aerialState = { kind: 'aerial', doubleJumpUsed: false, time: 0 }
				this.velX = 0
			}
		} else {
			if (this.controlsManager.y > delta) {
				this.crouch()
			} else {
				this.tryUncrouch()
			}
		}
		this.controlsManager.update()
		if (this.aerialState.kind === 'grounded' && this.canShoot) {
			this.velX = X_VELOCITY * this.controlsManager.x * (this.crouching ? 0.5 : 1)
		} else if (this.aerialState.kind === 'aerial') {
			this.velX += this.controlsManager.x * AIR_CONTROL
		}
		this.facing = this.controlsManager.x > 0 ? 1 : this.controlsManager.x < 0 ? -1 : this.facing
	}
	jump() {
		const stateBefore = this.aerialState
		if (
			stateBefore.kind === 'grounded' ||
			(stateBefore.kind === 'aerial' && stateBefore.time <= Player.COYOTE_TIME)
		) {
			if (!this.tryUncrouch()) {
				return false
			}
			this.aerialState = { kind: 'aerial', doubleJumpUsed: false, time: 0 }
		} else if (stateBefore.kind === 'aerial' && !stateBefore.doubleJumpUsed) {
			this.aerialState = { kind: 'aerial', doubleJumpUsed: true, time: 0 }
		} else {
			return false
		}
		this.velX = X_VELOCITY * this.controlsManager.x
		this.velY = -JUMP_VELOCITY
		this.jumped.emit(stateBefore, this.aerialState)
		return true
	}
	onGround() {
		return this.game.terrainCollision.isGrounded(this.worldBounds) ?? false
	}
	private calcShotInfo() {
		if (this.crouching) {
			return { x: this.facing, y: 0, crouching: true }
		}
		if (!this.controlsManager.y) {
			return { x: this.facing, y: 0 }
		}
		return { x: 0, y: this.controlsManager.y }
	}
	shoot() {
		this.lastShotTime = this.time
		if (this.aerialState.kind !== 'aerial') {
			this.velX = 0
		}
		const { x, y, crouching } = this.calcShotInfo()
		this.game.entitiesManager.spawn(
			new Projectile(this.game, {
				style: 'small',
				source: 'player',
				lifetime: 1.2,
				velX: 50 * x,
				velY: 50 * y,
				angle: Math.atan2(y, x),
				w: 6,
				h: 2,
				x: this.x + x * 3 + (y ? 0 : 3 * this.facing),
				y: this.y + (crouching ? -0.5 : -2) + y * 3,
				tint: 'cyan',
			}),
		)
		this.shotFired.emit()
	}
	createPixiEl(gc: GameController): GameEntityEl {
		return new PlayerEl(gc, this)
	}
	protected override move(delta: number) {
		const result = this.game.terrainCollision.resolveMovement(
			this.worldBounds,
			this.velX * delta,
			this.velY * delta,
		)
		this.x += result.x - this.worldBounds.x
		this.y += result.y - this.worldBounds.y
		if (result.hitHorizontal) {
			// this.velX = 0
		}
		if (result.hitVertical) {
			if (this.velY > 0) {
				this.aerialState = { kind: 'grounded', time: 0 }
			}
			this.velY = 0
		}
	}

	resetState() {
		this.velX = 0
		this.velY = 0
		this.aerialState = { kind: 'grounded', time: 0 }
		this.facing = 1
		this.controlsManager.reset()
	}

	private roomToUncrouch() {
		const worldBounds = this.worldBounds
		return !this.game.terrainCollision.overlapsSolid({
			x: worldBounds.x,
			width: worldBounds.width,
			y: worldBounds.y - CROUCH_DIFF,
			height: HEIGHT,
		})
	}

	private pushOutOfSolids(){
		this.game.terrainCollision.pushOutOfSolids(this)
	}
}
