import { Player } from '#lib/scripts/game/player/player.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'
import { type AnimationDef, WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'

type PlayerAnimationType =
	'idle' | 'jump' | 'run' | 'fall' | 'attack' | 'crouch' | 'crouch-move' | 'crouch-attack'

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
	'crouch-move': {
		frames: [9, 10],
		loop: true,
	},
	'crouch-attack': {
		frames: [11, 12, 13],
		speed: 0.3,
	},
}

const FAILED_COYOTE_JUMP_THRESHOLD = 0.07

export class PlayerEl extends WithManSprite {
	private currentAnimation: PlayerAnimationType = 'idle'
	constructor(
		gc: GameController,
		private player: Player,
	) {
		super(gc, player)
		this.setAnimation(defs.idle)
		this.sprite.tint = 'cyan'
		this.zIndex = 1
		player.jumped.listen((before, after) => {
			const totalThreshold = FAILED_COYOTE_JUMP_THRESHOLD + Player.COYOTE_TIME
			if (
				before.kind === 'aerial' &&
				after.kind === 'aerial' &&
				after.doubleJumpUsed &&
				before.time <= totalThreshold
			) {
				this.failedCoyoteJump()
			}
		})
		player.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(player.worldBounds, 'cyan', 2, 3))
		})
	}
	draw() {
		const nextAnimation = this.getAnimation()
		if (nextAnimation !== this.currentAnimation) {
			this.setAnimation(defs[nextAnimation])
			this.currentAnimation = nextAnimation
		}
		this.sprite.scale.x = Math.sign(this.player.facing)
		this.sprite.y = this.player.crouching ? -2 : 0
	}
	private failedCoyoteJump() {
		// TODO: this
	}

	private getAnimation(): PlayerAnimationType {
		if (this.player.shotCooldown > 0) {
			if (this.player.crouching) {
				return 'crouch-attack'
			}
			return 'attack'
		}
		if (this.player.aerialState.kind === 'aerial') {
			return this.player.velX == 0 ? 'fall' : 'jump'
		}
		if (this.player.crouching) {
			if (this.player.velX !== 0) {
				return 'crouch-move'
			}
			return 'crouch'
		}
		if (this.player.velX !== 0) {
			return 'run'
		}
		return 'idle'
	}
}
