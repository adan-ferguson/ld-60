import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import { AnimatedSprite, Assets, type Spritesheet, type Texture, type TextureSource } from 'pixi.js'

AssetUtils.requestPreload({
	alias: 'man-spritesheet',
	src: '/assets/sprites/man.json',
})

export type AnimationDef = {
	frames: number[]
	loop?: boolean
	speed?: number
}

let cachedTextures: Texture[] | undefined = undefined
function getTextures(frames: number[]): Texture[] {
	if (!cachedTextures) {
		const spritesheet = Assets.get<Spritesheet>('man-spritesheet')
		if (!spritesheet) {
			throw new Error('The man spritesheet has not been loaded')
		}
		cachedTextures = Object.values(spritesheet.textures)
	}
	return frames.map((f) => cachedTextures![f]!)
}

export abstract class WithManSprite extends GameEntityEl {
	protected sprite!: AnimatedSprite
	protected setAnimation(def: AnimationDef) {
		const textures = getTextures(def.frames)
		if (!this.sprite) {
			this.sprite = new AnimatedSprite(textures)
			this.addChild(this.sprite)
			this.sprite.anchor.set(0.5)
		} else {
			this.sprite.stop()
			this.sprite.textures = textures
		}
		this.sprite.animationSpeed = def.speed ?? 0.12
		this.sprite.loop = def.loop ?? false
		this.sprite.gotoAndPlay(0)
	}
}
