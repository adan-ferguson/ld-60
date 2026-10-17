import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'
import { Graphics } from 'pixi.js'

export class PlayerEl extends GameEntityEl {
	private gfx: Graphics
	constructor(private player: Player) {
		super(player)
		this.addChild((this.gfx = new Graphics()))
	}
	draw() {
		this.gfx.clear()
		const { x, y, width, height } = this.player.localBounds
		this.gfx.rect(x, y, width, height).fill('blue')
	}
}
