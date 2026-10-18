import type { GameController } from '#lib/scripts/gameController.ts'
import type { Man } from '#lib/scripts/game/enemies/man.ts'
import { type PlayerAnimation, WithManSprite } from '#lib/scripts/pixi/entities/playerEl.ts'

export class ManEl extends WithManSprite {
	constructor(
		gc: GameController,
		private man: Man,
	) {
		super(gc, man)
		this.setAnimation('idle')
		this.sprite.tint = 'red'
	}
}
