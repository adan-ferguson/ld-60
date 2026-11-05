import type { GameController } from '#lib/scripts/gameController.ts'
import { type Man } from '#lib/scripts/game/entities/man.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'
import { type AnimationDef, WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'

export type ManAnimationType = 'run' | 'attack' | 'attackWindup' | 'stand'

const defs: Record<ManAnimationType, AnimationDef> = {
	run: {
		frames: [0, 2, 3, 4],
		loop: true,
	},
	attack: {
		frames: [6, 7],
		speed: 0.3,
	},
	attackWindup: {
		frames: [5],
	},
	stand: {
		frames: [0],
	},
}

export class ManEl extends WithManSprite {
	constructor(
		gc: GameController,
		private man: Man,
	) {
		super(gc, man)
		this.setAnimation(defs[man.defaultAnimation])
		this.sprite.tint = 'red'
		man.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(man.worldBounds, 'red', 2, 3))
		})
		man.animationChanged.listen((type) => {
			this.setAnimation(defs[type])
		})
	}

	override get debugRects() {
		return [this.man.hitbox]
	}

	update2() {}
}
