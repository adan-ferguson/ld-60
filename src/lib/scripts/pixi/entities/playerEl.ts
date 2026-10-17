import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'
import { type AnimatedSprite, Graphics } from 'pixi.js'

export class PlayerEl extends GameEntityEl {
	private readonly sprite: AnimatedSprite
	constructor(private player: Player) {
		super(player)
		this.sprite = createAnimation('player', 'player-idle-', {
			animationSpeed: 0.1,
		})
		this.sprite.anchor.set(0.5)
		this.addChild(this.sprite)
	}
	draw() {
		this.sprite.scale.x = Math.sign(this.player.facing)
	}
}
