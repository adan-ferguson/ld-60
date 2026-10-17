import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'

export class PlayerEl extends GameEntityEl {
	constructor(private player: Player) {
		super()
	}
	update() {}
}
