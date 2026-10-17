import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Projectile, ProjectileStyle } from '#lib/scripts/game/projectile.ts'
import { AnimatedSprite, Assets, type Spritesheet, Texture, TextureSource } from 'pixi.js'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

rp('small')
rp('large')

function rp(style: ProjectileStyle) {
	AssetUtils.requestPreload(`/assets/sprites/projectile_${style}.json`, `projectile_${style}`)
}

const frames: Map<ProjectileStyle, Texture<TextureSource<any>>[]> = new Map()

export class ProjectileEl extends GameEntityEl {
	constructor(proj: Projectile) {
		super(proj)
		const spritesheet = Assets.get<Spritesheet>(`projectile_${proj.options.style}`)
		if (!spritesheet) {
			throw new Error('The man spritesheet has not been loaded')
		}
		const sprite = new AnimatedSprite({
			textures: getFrames(proj.options.style),
			animationSpeed: 0.33,
			loop: true,
			autoPlay: true,
			anchor: { x: 0.5, y: 0.5 },
			scale: { x: proj.options.velX < 0 ? -1 : 1, y: 1 },
		})
		this.addChild(sprite)
	}
}

function getFrames(style: ProjectileStyle) {
	if (!frames.has(style)) {
		const spritesheet = Assets.get<Spritesheet>(`projectile_${style}`)
		if (!spritesheet) {
			throw new Error('The man spritesheet has not been loaded')
		}
		frames.set(style, extractFrames(spritesheet))
	}
	return frames.get(style)!
}

function extractFrames(spritesheet: Spritesheet) {
	const textureNames = Object.keys(spritesheet.textures).sort(
		(a, b) => getFrameNumber(a) - getFrameNumber(b),
	)
	return textureNames.map((name) => spritesheet.textures[name]!)
}

function getFrameNumber(name: string) {
	const match = name.match(/(\d+)/)

	if (!match) {
		throw new Error(`Could not find a frame number in sprite name "${name}"`)
	}

	return Number(match[1])
}
