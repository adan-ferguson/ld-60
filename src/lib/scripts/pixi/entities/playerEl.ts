import { Player } from '#lib/scripts/game/player/player.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'
import { type AnimationDef, WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { Graphics } from 'pixi.js'

type PlayerAnimationType =
	'idle' | 'jump' | 'run' | 'fall' | 'attack' | 'crouch' | 'crouchMove' | 'crouchAttack'

const defs: Record<PlayerAnimationType, AnimationDef> = {
	idle: {
		frames: [0],
	},
	run: {
		frames: [0, 2, 3, 4],
		loop: true,
	},
	jump: {
		frames: [1],
	},
	fall: {
		frames: [8],
	},
	attack: {
		frames: [5, 6, 7],
		speed: 0.3,
	},
	crouch: {
		frames: [9],
	},
	crouchMove: {
		frames: [9, 10],
		loop: true,
	},
	crouchAttack: {
		frames: [11, 12, 13],
		speed: 0.3,
	},
}

export class PlayerEl extends WithManSprite {
	private currentAnimation: PlayerAnimationType = 'idle'
	private shotAnimationTime = 0
	constructor(
		gc: GameController,
		private player: Player,
	) {
		super(gc, player)
		this.setAnimation(defs.idle)
		this.sprite.tint = 'cyan'
		this.zIndex = 1
		player.jumped.listen((before, after) => {
			if (after.kind === 'aerial' && after.doubleJumpUsed) {
				this.airJumpFx()
			}
		})
		player.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(player.worldBounds, 'cyan', 2, 3))
		})
		player.shotFired.listen(() => {
			this.setAnimationType(this.player.crouching ? 'crouchAttack' : 'attack')
			this.shotAnimationTime = 0.3
		})
	}

	update2(delta: number) {
		this.shotAnimationTime = Math.max(0, this.shotAnimationTime - delta)
		const nextAnimation = this.getAnimation()
		if (nextAnimation && nextAnimation !== this.currentAnimation) {
			this.setAnimationType(nextAnimation)
		}
		this.sprite.scale.x = Math.sign(this.player.facing)
		this.sprite.y = this.player.crouching ? -2 : 0
	}

	private setAnimationType(animationType: PlayerAnimationType) {
		this.currentAnimation = animationType
		this.setAnimation(defs[animationType])
	}

	private airJumpFx() {
		const gfx = new Graphics()
		const WIDTH = 12
		gfx.x = this.player.x
		gfx.y = this.player.worldBounds.bottom - 2
		const animation = new VfxAnimation(gfx, {
			draw: (t) => {
				const x = WIDTH * t
				gfx
					.clear()
					.moveTo(-x / 2, 0)
					.lineTo(x / 2, 0)
					.stroke({
						color: 'white',
						width: 1,
					})
			},
			duration: 0.2,
		})
		this.gc.addAnimation(animation)
	}

	private getAnimation(): PlayerAnimationType | false {
		if (this.shotAnimationTime > 0) {
			return false
		}
		if (this.player.aerialState.kind === 'aerial') {
			return this.player.velX == 0 ? 'fall' : 'jump'
		}
		if (this.player.crouching) {
			if (this.player.velX !== 0) {
				return 'crouchMove'
			}
			return 'crouch'
		}
		if (this.player.velX !== 0) {
			return 'run'
		}
		return 'idle'
	}
}
