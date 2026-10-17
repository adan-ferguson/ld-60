import type { Game } from '#lib/scripts/game/game.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { ControlsManager } from '#lib/scripts/game/player/controlsManager.ts'

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
const GRAVITY = 4

export class Player {
	position: XY = { x: 0, y: 0 }
	velocity: XY = { x: 0, y: 0 }
	aerialState: AerialState = { kind: 'grounded' }
	private controlsManager: ControlsManager
	get canJump() {
		return (
			this.aerialState.kind === 'grounded' ||
			(this.aerialState.kind === 'aerial' && !this.aerialState.doubleJumpUsed)
		)
	}
	get canShoot() {
		return true // TODO: whatever
	}
	constructor(game: Game) {
		this.controlsManager = new ControlsManager(this)
	}
	update(deltaMS: number) {
		if (this.onGround()) {
			this.aerialState.kind = 'grounded'
		}
		this.controlsManager.update()
		this.velocity.x = X_VELOCITY * this.controlsManager.x
		this.velocity.y += GRAVITY * (deltaMS / 1000)
	}
	jump() {
		if (this.aerialState.kind === 'grounded') {
			this.aerialState = { kind: 'aerial', doubleJumpUsed: false }
		} else if (this.aerialState.kind === 'aerial') {
			this.aerialState = { kind: 'aerial', doubleJumpUsed: true }
		}
		this.velocity.y = -JUMP_VELOCITY
	}
	onGround() {
		return true // TODO: implement ground detection
	}
	shoot() {}
}
