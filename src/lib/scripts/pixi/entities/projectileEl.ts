import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Projectile, ProjectileStyle } from '#lib/scripts/game/projectile.ts'
import { AnimatedSprite, Assets, Graphics, type Spritesheet, Texture, TextureSource } from 'pixi.js'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'
import type { GameController } from '#lib/scripts/gameController.ts'

rp('small')
rp('large')

function rp(style: ProjectileStyle) {
	AssetUtils.requestPreload({
		src: `/assets/sprites/projectile_${style}.json`,
		alias: `projectile_${style}`,
	})
}

const frames: Map<ProjectileStyle, Texture<TextureSource<any>>[]> = new Map()

export class ProjectileEl extends GameEntityEl {
	constructor(
		gc: GameController,
		private proj: Projectile,
	) {
		super(gc, proj)
		if (proj.options.style === 'dot') {
			this.gfxy()
		} else {
			this.spritey()
		}
	}
	gfxy() {
		const gfx = new Graphics()
		gfx.circle(0, 0, this.proj.options.size).fill('red')
		this.addChild(gfx)
	}
	spritey() {
		const spritesheet = Assets.get<Spritesheet>(`projectile_${this.proj.options.style}`)
		if (!spritesheet) {
			throw new Error('The man spritesheet has not been loaded')
		}
		const sprite = new AnimatedSprite({
			textures: getFrames(this.proj.options.style),
			animationSpeed: 0.33,
			loop: true,
			autoPlay: true,
			anchor: { x: 0.5, y: 0.5 },
			rotation: this.proj.options.angle,
		})
		this.tint = this.proj.options.tint
		this.zIndex = 2
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
