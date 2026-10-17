import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'
import { Graphics } from 'pixi.js'

const SIZE = 12

export class PlayerEl extends GameEntityEl {
	private gfx: Graphics
	constructor(private player: Player) {
		super(player)
		this.addChild((this.gfx = new Graphics()))
	}
	draw() {
		this.gfx.clear()
		this.gfx.rect(-SIZE / 2, -SIZE / 2, SIZE, SIZE).fill('blue')
	}
}
