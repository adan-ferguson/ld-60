import type { GameController } from '#lib/scripts/gameController.ts'
import type { Man } from '#lib/scripts/game/enemies/man.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'
import { type AnimationDef, WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'

type ManAnimationType = 'run'

const defs: Record<ManAnimationType, AnimationDef> = {
	run: {
		frames: [0, 2, 3, 4],
		loop: true,
	},
}

export class ManEl extends WithManSprite {
	constructor(
		gc: GameController,
		private man: Man,
	) {
		super(gc, man)
		this.setAnimation(defs.run)
		this.sprite.tint = 'red'
		man.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(man.worldBounds, 'red', 2, 3))
		})
	}

	draw() {
		this.sprite.scale.x = Math.sign(this.man.facing)
	}
}
