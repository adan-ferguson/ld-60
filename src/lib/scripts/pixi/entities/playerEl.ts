import type { Player } from '#lib/scripts/game/player/player.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'
import { type ManAnimationType, WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'

export class PlayerEl extends WithManSprite {
	constructor(
		gc: GameController,
		private player: Player,
	) {
		super(gc, player)
		this.setAnimation('idle')
		this.sprite.tint = 'cyan'
		this.zIndex = 1
		player.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(player.worldBounds, 'cyan', 2, 3))
		})
	}
	draw() {
		const nextAnimation = this.getAnimation()
		if (nextAnimation !== this.currentAnimation) {
			this.setAnimation(nextAnimation)
		}
		this.sprite.scale.x = Math.sign(this.player.facing)
	}

	private getAnimation(): ManAnimationType {
		if (this.player.shotCooldown > 0) {
			return 'throw'
		}
		if (this.player.aerialState.kind === 'aerial') {
			return this.player.velX == 0 ? 'fall' : 'jump'
		}
		if (this.player.velX !== 0) {
			return 'run'
		}
		return 'idle'
	}
}
