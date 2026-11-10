import { ControlsManager } from '#lib/scripts/game/player/controlsManager.ts'
import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { PlayerEl } from '#lib/scripts/pixi/entities/playerEl.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import { trySnapToCeilingGap } from '#lib/scripts/game/collisions/trySnapToCeilingGap.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

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

const JUMP_VELOCITY = 68
const X_VELOCITY = 34
const GRAVITY = 135
const MAX_FALL_SPEED = 200
const WIDTH = 7
const HEIGHT = 12
const CROUCH_DIFF = 4
const SHOT_COOLDOWN = 0.21
const AIR_CONTROL = 0.06
const MAX_X_VELOCITY_FOR_CEILING_SNAP = 2.5
const CEILING_SNAP_DISTANCE = 1.5

export class Player extends GameEntity {
	static COYOTE_TIME = 0.07
	#dropThroughTime = 0
	aerialState: AerialState = { kind: 'grounded', time: 0 }
	private controlsManager: ControlsManager
	public jumped =
		CoolEvents.createHandler<(stateBefore: AerialState, stateAfter: AerialState) => void>()
	lastShotTime = 0
	crouching: boolean = false
	public shotFired = CoolEvents.createHandler()
	stopped = false
	constructor(level: LevelInstance, spawnPosition: XY) {
		super(level)
		this.setTileXY(spawnPosition)
		this.controlsManager = new ControlsManager(this)
	}
	get canShoot() {
		return this.time - this.lastShotTime >= SHOT_COOLDOWN
	}
	public get baseWidth(): number {
		return WIDTH
	}
	public get baseHeight(): number {
		return this.crouching ? HEIGHT - CROUCH_DIFF : HEIGHT
	}
	public override get canStandOnMovingBlocks() {
		return true
	}
	public override get hazardHurtbox() {
		return this.localBounds.pad({ x: -1, y: -3 })
	}
	public override get squishable() {
		return true
	}
	get ignoringThinFloors() {
		return this.#dropThroughTime > 0
	}
	tryCrouch() {
		if (this.crouching) {
			return false
		}
		this.y += CROUCH_DIFF / 2
		this.crouching = true
		return true
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
		this.#dropThroughTime = Math.max(0, this.#dropThroughTime - delta)
		this.level.worldCollision.pushOutOfSolids(this)
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
				this.tryCrouch()
			} else {
				this.tryUncrouch()
			}
			if (this.aerialState.kind !== 'grounded') {
				this.aerialState = { kind: 'grounded', time: 0 }
			}
		}
		this.controlsManager.update()
		if (this.aerialState.kind === 'grounded') {
			if (this.canShoot) {
				this.velX = X_VELOCITY * this.controlsManager.x * (this.crouching ? 0.5 : 1)
			} else {
				this.velX = 0
			}
		} else if (this.aerialState.kind === 'aerial') {
			this.velX += this.controlsManager.x * AIR_CONTROL
			this.velX = Math.max(-X_VELOCITY, Math.min(X_VELOCITY, this.velX))
		}
		this.facing = this.controlsManager.x > 0 ? 1 : this.controlsManager.x < 0 ? -1 : this.facing
	}
	jump() {
		const stateBefore = this.aerialState
		if (this.#tryDropThroughFloor()) {
			return true
		}
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
		return (
			this.level.worldCollision.isGrounded(this.worldBounds, this.#dropThroughTime > 0) ?? false
		)
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
		this.level.entitiesManager.spawn(
			new Projectile(this.level, {
				style: 'small',
				source: this,
				lifetime: 1.25,
				velX: 50 * x,
				velY: 50 * y,
				angle: Math.atan2(y, x),
				hitbox: y ? { x: 3, y: 6 } : { x: 6, y: 3 },
				wallHitbox: y ? { x: 3, y: 1 } : { x: 1, y: 3 },
				x: this.x + x * 3 + (y ? 0 : 3 * this.facing),
				y: this.y + (crouching ? -0.5 : -1.5) + y * 5,
				tint: 'cyan',
			}),
		)
		this.shotFired.emit()
	}
	createPixiEl(gc: GameController): GameEntityEl {
		return new PlayerEl(gc, this)
	}
	protected override move(delta: number) {
		const result = this.level.worldCollision.resolveMovement(
			this.worldBounds,
			this.velX * delta,
			this.velY * delta,
			this.#dropThroughTime > 0,
		)
		this.x += result.x - this.worldBounds.x
		this.y += result.y - this.worldBounds.y
		if (result.verticalSolids.length > 0) {
			if (this.velY > 0) {
				this.aerialState = { kind: 'grounded', time: 0 }
				this.velY = 0
			} else if (Math.abs(this.velX) < MAX_X_VELOCITY_FOR_CEILING_SNAP) {
				if (!trySnapToCeilingGap(this, CEILING_SNAP_DISTANCE)) {
					this.velY = 0
				}
			} else {
				this.velY = 0
			}
		}
	}

	private roomToUncrouch() {
		const worldBounds = this.worldBounds
		return !this.level.worldCollision.overlapsSolid(
			new CoolRect({
				x: worldBounds.x,
				width: worldBounds.width,
				y: worldBounds.y - CROUCH_DIFF,
				height: HEIGHT,
			}),
		)
	}

	protected override isSquished() {
		if (super.isSquished()) {
			this.tryCrouch()
			return super.isSquished()
		}
		return false
	}

	#tryDropThroughFloor() {
		if (this.controlsManager.y > 0 && this.aerialState.kind === 'grounded') {
			const ground = this.level.worldCollision.getGround(this.worldBounds)
			if (!ground.length || ground.some((g) => !g.thinFloor)) {
				return false
			}
			this.#dropThroughTime = 0.15
			this.velY = 1
			this.aerialState = {
				kind: 'aerial',
				doubleJumpUsed: false,
				time: 0,
			}
			return true
		}
		return false
	}
}
