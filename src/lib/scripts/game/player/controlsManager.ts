import { getInputState } from '#lib/scripts/game/player/inputManager.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'

export class ControlsManager {
	private button1Ready = true
	private button2Ready = true
	public x: number = 0
	constructor(private player: Player) {}
	get inputState() {
		return getInputState()
	}
	update() {
		this.tryJump()
		this.tryShoot()
		if (this.player.aerialState.kind === 'grounded') {
			this.x = this.inputState.moveX
		}
	}
	private tryJump() {
		if (!this.inputState.button1) {
			this.button1Ready = true
		} else if (!this.button1Ready || !this.player.canJump) {
			return
		}
		this.button1Ready = false
		this.player.jump()
		this.x = this.inputState.moveX
	}
	private tryShoot() {
		if (!this.inputState.button2) {
			this.button2Ready = true
		} else if (!this.button2Ready || !this.player.canShoot) {
			return
		}
		this.button2Ready = false
		this.player.shoot()
	}
}
