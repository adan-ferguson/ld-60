import { getInputState, type InputState } from '#lib/scripts/game/player/inputManager.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'

export class ControlsManager {
	private button1Ready = true
	private button2Ready = true
	private inputState: InputState | undefined
	public x = 0
	public y = 0
	public facing = 1
	constructor(private player: Player) {}
	update() {
		this.inputState = getInputState()
		this.tryJump()
		this.tryShoot()
		this.x = this.inputState.moveX
		this.y = this.inputState.moveY
	}
	private tryJump() {
		if (!this.inputState?.button2) {
			this.button2Ready = true
			return
		} else if (!this.button2Ready || !this.player.canJump) {
			return
		}
		this.button2Ready = false
		this.player.jump()
		this.x = this.inputState.moveX
	}
	private tryShoot() {
		if (!this.inputState?.button1) {
			this.button1Ready = true
			return
		} else if (!this.button1Ready || !this.player.canShoot) {
			return
		}
		this.button1Ready = false
		this.player.shoot()
	}

	reset() {
		this.button1Ready = true
		this.button2Ready = true
		this.inputState = undefined
		this.x = 0
		this.y = 0
		this.facing = 1
	}
}
