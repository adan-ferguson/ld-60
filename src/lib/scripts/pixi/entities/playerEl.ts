import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Player } from '#lib/scripts/game/player/player.ts'
import { AnimatedSprite, Assets, Spritesheet } from 'pixi.js'

type PlayerAnimation = 'idle' | 'jump' | 'run' | 'fall' | 'throw'

export class PlayerEl extends GameEntityEl {
	private sprite!: AnimatedSprite
	private currentAnimation: PlayerAnimation = 'idle'
	constructor(private player: Player) {
		super(player)
		this.setAnimation('idle')
	}
	draw() {
		const nextAnimation = this.getAnimation()

		if (nextAnimation !== this.currentAnimation) {
			this.setAnimation(nextAnimation)
		}

		this.sprite.scale.x = Math.sign(this.player.facing)
	}

	private getAnimation(): PlayerAnimation {
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

	private setAnimation(animation: PlayerAnimation) {
		const spritesheet = Assets.get<Spritesheet>('man-spritesheet')
		if (!spritesheet) {
			throw new Error('The man spritesheet has not been loaded')
		}
		if (!this.sprite) {
			this.sprite = new AnimatedSprite(spritesheet.animations[animation]!)
			this.addChild(this.sprite)
		}
		this.currentAnimation = animation
		this.sprite.textures = spritesheet.animations[animation]!
		this.sprite.anchor.set(0.5)
		if (animation == 'throw') {
			this.sprite.animationSpeed = 0.18
			this.sprite.loop = true
		} else {
			this.sprite.animationSpeed = 0.12
			this.sprite.loop = true
		}
		this.sprite.play()
	}
}
