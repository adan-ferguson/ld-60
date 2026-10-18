import Game from '#lib/scripts/game/game.ts'
import { ControlsManager } from '#lib/scripts/game/player/controlsManager.ts'
import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { PlayerEl } from '#lib/scripts/pixi/entities/playerEl.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { Projectile } from '#lib/scripts/game/projectile.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Rectangle } from 'pixi.js'

export type AerialState =
	| {
			kind: 'grounded'
	  }
	| {
			kind: 'aerial'
			doubleJumpUsed: boolean
	  }

const JUMP_VELOCITY = 65
const X_VELOCITY = 36
const GRAVITY = 125
const MAX_FALL_SPEED = 200
const WIDTH = 8
const HEIGHT = 12
const SHOT_COOLDOWN = 0.25
const AIR_CONTROL = 0.04

export class Player extends GameEntity {
	aerialState: Readonly<AerialState> = { kind: 'grounded' }
	private controlsManager: ControlsManager
	shotCooldown = 0
	constructor(game: Game) {
		super(game)
		this.controlsManager = new ControlsManager(this)
	}
	get hurtboxBounds() {
		return new Rectangle(
			this.worldBounds.x + this.worldBounds.width / 4,
			this.worldBounds.y + this.worldBounds.height / 4,
			this.worldBounds.width / 2,
			this.worldBounds.height / 2,
		)
	}
	get width() {
		return WIDTH
	}
	get height() {
		return HEIGHT
	}
	get canJump() {
		return (
			this.aerialState.kind === 'grounded' ||
			(this.aerialState.kind === 'aerial' && !this.aerialState.doubleJumpUsed)
		)
	}
	get canShoot() {
		return this.shotCooldown <= 0
	}
	update2(delta: number) {
		if (!this.onGround()) {
			this.velY += GRAVITY * delta
			this.velY = Math.min(this.velY, MAX_FALL_SPEED)
			if (this.aerialState.kind === 'grounded') {
				this.aerialState = { kind: 'aerial', doubleJumpUsed: false }
				this.velX = 0
			}
		}
		this.controlsManager.update()
		if (this.aerialState.kind === 'grounded' && this.shotCooldown === 0) {
			this.velX = X_VELOCITY * this.controlsManager.x
		} else if (this.aerialState.kind === 'aerial') {
			this.velX += this.controlsManager.x * AIR_CONTROL
		}
		this.facing = this.controlsManager.x > 0 ? 1 : this.controlsManager.x < 0 ? -1 : this.facing
		this.shotCooldown = Math.max(0, this.shotCooldown - delta)
	}
	jump() {
		if (this.aerialState.kind === 'grounded') {
			this.aerialState = { kind: 'aerial', doubleJumpUsed: false }
			this.velX = X_VELOCITY * this.controlsManager.x
		} else if (this.aerialState.kind === 'aerial') {
			this.aerialState = { kind: 'aerial', doubleJumpUsed: true }
			this.velX = X_VELOCITY * this.controlsManager.x
		}
		this.velY = -JUMP_VELOCITY
	}
	onGround() {
		return this.game.level?.terrainCollision.isGrounded(this.worldBounds) ?? false
	}
	shoot() {
		this.shotCooldown = SHOT_COOLDOWN
		if (this.aerialState.kind !== 'aerial') {
			this.velX = 0
		}
		const y = this.controlsManager.y
		const x = y ? 0 : this.facing
		this.game.entitiesManager.spawn(
			new Projectile(this.game, {
				style: 'small',
				size: 5,
				source: 'player',
				lifetime: 0.8,
				velX: 50 * x,
				velY: 50 * y,
				angle: Math.atan2(y, x),
				x: this.x + this.facing * 5,
				y: this.y - 2,
				tint: 'cyan',
			}),
		)
	}
	createPixiEl(gc: GameController): GameEntityEl {
		return new PlayerEl(gc, this)
	}
	protected override move(delta: number) {
		const terrainCollision = this.game.level?.terrainCollision
		if (!terrainCollision) {
			return
		}
		const result = terrainCollision.resolveMovement(
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
				this.aerialState = { kind: 'grounded' }
			}
			this.velY = 0
		}
	}
}
