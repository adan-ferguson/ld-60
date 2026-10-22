import type { GameController } from '#lib/scripts/gameController.ts'
import type { Man } from '#lib/scripts/game/enemies/man.ts'
import { WithManSprite } from '#lib/scripts/pixi/entities/playerEl.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'

export class ManEl extends WithManSprite {
	constructor(
		gc: GameController,
		private man: Man,
	) {
		super(gc, man)
		this.setAnimation('run')
		this.sprite.tint = 'red'
		man.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(man.worldBounds, 'red', 2, 3))
		})
	}

	draw() {
		this.sprite.scale.x = Math.sign(this.man.facing)
	}
}
