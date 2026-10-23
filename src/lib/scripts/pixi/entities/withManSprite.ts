import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import { AnimatedSprite, Assets, type Spritesheet, type Texture, type TextureSource } from 'pixi.js'

AssetUtils.requestPreload({
	alias: 'man-spritesheet',
	src: '/assets/sprites/man.json',
})

type ManAnimationDef = {
	frames: number[]
	loop?: boolean
}

export type ManAnimationType =
	'idle' | 'jump' | 'run' | 'fall' | 'attack' | 'crouch' | 'crouch-move' | 'crouch-attack'

const defs: Record<ManAnimationType, ManAnimationDef> = {
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
	},
}

let __textures: Record<ManAnimationType, Texture[]> | undefined = undefined
function getTextures(): Record<ManAnimationType, Texture[]> {
	if (__textures) {
		return __textures
	}
	const spritesheet = Assets.get<Spritesheet>('man-spritesheet')
	if (!spritesheet) {
		throw new Error('The man spritesheet has not been loaded')
	}
	const entries = Object.entries(defs).map((entry) => {
		const [type, def] = entry
		return [type, def.frames.map((frame) => getTexture(frame))]
	})
	__textures = Object.fromEntries(entries)
	if (!__textures) {
		throw 'Uhoh'
	}
	return __textures
	function getTexture(frame: number) {
		const name = `man ${frame}.aseprite`
		const texture = spritesheet.textures[name]
		if (!texture) {
			throw new Error(`Missing frame "${name}" in man.json`)
		}
		return texture
	}
}

export class WithManSprite extends GameEntityEl {
	protected sprite!: AnimatedSprite
	protected currentAnimation: ManAnimationType = 'idle'
	protected setAnimation(animation: ManAnimationType) {
		const def = defs[animation]
		const textures = getTextures()[animation]
		if (!this.sprite) {
			this.sprite = new AnimatedSprite(textures)
			this.addChild(this.sprite)
			this.sprite.anchor.set(0.5)
		} else {
			this.sprite.stop()
			this.sprite.textures = textures
		}
		this.currentAnimation = animation
		this.sprite.animationSpeed = 0.12
		this.sprite.loop = def.loop ?? false
		this.sprite.gotoAndPlay(0)
	}
}
