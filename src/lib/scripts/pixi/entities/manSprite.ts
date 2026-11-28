import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import { AnimatedSprite, Assets, type Spritesheet, type Texture } from 'pixi.js'

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
		cachedTextures = Object.keys(spritesheet.textures)
			.map((name) => {
				const match = name.match(/^man (\d+)\.aseprite$/)
				if (!match) {
					return undefined
				}
				return {
					index: Number(match[1]),
					texture: spritesheet.textures[name]!,
				}
			})
			.filter((entry): entry is { index: number; texture: Texture } => entry !== undefined)
			.sort((a, b) => a.index - b.index)
			.map((entry) => entry.texture)
	}
	return frames.map((frame) => {
		const texture = cachedTextures?.[frame]
		if (!texture) {
			throw new Error(`Missing cached man frame ${frame}`)
		}
		return texture
	})
}

export class ManSprite extends AnimatedSprite {
	constructor() {
		super(getTextures([0]))
		this.anchor.set(0.5)
	}
	setAnimation(def: AnimationDef) {
		this.stop()
		this.textures = getTextures(def.frames)
		this.animationSpeed = def.speed ?? 0.12
		this.loop = def.loop ?? false
		this.gotoAndPlay(0)
	}
}
