import type { GameController } from '#lib/scripts/gameController.ts'
import { type Man, ManStateTypes } from '#lib/scripts/game/enemies/man.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'
import { type AnimationDef, WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'

type ManAnimationType = 'run' | 'attack' | 'attackWindup' | 'stand'

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
		this.setIdleAnimation()
		this.sprite.tint = 'red'
		man.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(man.worldBounds, 'red', 2, 3))
		})
		man.stateChanged.listen((state) => {
			if (state instanceof ManStateTypes.Idle) {
				this.setIdleAnimation()
			} else if (state instanceof ManStateTypes.Attack) {
				this.setAnimation(defs.attack)
			} else if (state instanceof ManStateTypes.AttackWindup) {
				this.setAnimation(defs.attackWindup)
			}
		})
	}

	override get debugRects() {
		return [this.man.visionRect]
	}

	update2() {
		this.sprite.scale.x = Math.sign(this.man.facing)
	}

	private setIdleAnimation() {
		if (this.man.behavior === 'patrol') {
			this.setAnimation(defs.run)
		} else {
			this.setAnimation(defs.stand)
		}
	}
}
