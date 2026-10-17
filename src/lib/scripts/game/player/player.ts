import type { Game } from '#lib/scripts/game/game.ts'
import { ControlsManager } from '#lib/scripts/game/player/controlsManager.ts'
import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import { PlayerEl } from '#lib/scripts/pixi/entities/playerEl.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'

export type AerialState =
	| {
			kind: 'grounded'
	  }
	| {
			kind: 'aerial'
			doubleJumpUsed: boolean
	  }

const JUMP_VELOCITY = 8
const X_VELOCITY = 6
const GRAVITY = 40
const MAX_FALL_SPEED = 200

export class Player extends GameEntity {
	aerialState: Readonly<AerialState> = { kind: 'grounded' }
	private controlsManager: ControlsManager
	constructor(game: Game) {
		super(game)
		this.controlsManager = new ControlsManager(this)
	}
	get canJump() {
		return (
			this.aerialState.kind === 'grounded' ||
			(this.aerialState.kind === 'aerial' && !this.aerialState.doubleJumpUsed)
		)
	}
	get canShoot() {
		return true // TODO: whatever
	}
	update2(deltaMS: number) {
		if (this.onGround()) {
			this.aerialState = { kind: 'grounded' }
		}
		this.controlsManager.update()
		this.velX = X_VELOCITY * this.controlsManager.x
		this.velY += GRAVITY * (deltaMS / 1000)
		this.velY = Math.min(this.velY, MAX_FALL_SPEED)
	}
	jump() {
		if (this.aerialState.kind === 'grounded') {
			this.aerialState = { kind: 'aerial', doubleJumpUsed: false }
		} else if (this.aerialState.kind === 'aerial') {
			this.aerialState = { kind: 'aerial', doubleJumpUsed: true }
		}
		this.velY = -JUMP_VELOCITY
	}
	onGround() {
		return true // TODO: implement ground detection
	}
	shoot() {}
	createPixiEl(): GameEntityEl {
		return new PlayerEl(this)
	}
}
