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

const DAMAGE_FLASH_TIME = 0.1

export class ManEl extends WithManSprite {
	#flashTime = 0
	constructor(
		gc: GameController,
		private man: Man,
	) {
		super(gc, man)
		this.setAnimation(defs[man.defaultAnimation])
		this.sprite.tint = man.color
		man.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(man.worldBounds, man.color, 2, 3))
		})
		man.animationChanged.listen((type) => {
			this.setAnimation(defs[type])
		})
		man.damageTaken.listen(() => {
			this.#flashTime = DAMAGE_FLASH_TIME
			this.sprite.tint = 'white'
		})
	}

	override get debugRects() {
		return [this.man.hitbox]
	}

	update2(delta: number) {
		if (this.#flashTime > 0) {
			this.#flashTime -= delta
			if (this.#flashTime <= 0) {
				this.sprite.tint = this.man.color
			}
		}
		if (this.man.flashInterval) {
			const flash = Math.floor(this.man.time / this.man.flashInterval) % 2 === 0
			this.sprite.tint = flash ? 'white' : this.man.color
		}
	}
}
