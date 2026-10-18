import type { GameController } from '#lib/scripts/gameController.ts'
import type { Man } from '#lib/scripts/game/enemies/man.ts'
import { WithManSprite } from '#lib/scripts/pixi/entities/playerEl.ts'

export class ManEl extends WithManSprite {
	constructor(
		gc: GameController,
		private man: Man,
	) {
		super(gc, man)
		this.setAnimation('run')
		this.sprite.tint = 'red'
	}

	draw() {
		this.sprite.scale.x = Math.sign(this.man.facing)
	}
}
