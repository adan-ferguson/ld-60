import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Projectile, ProjectileStyle } from '#lib/scripts/game/projectile.ts'
import { AnimatedSprite, Assets, type Spritesheet } from 'pixi.js'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

rp('small')
rp('large')

function rp(style: ProjectileStyle) {
	AssetUtils.requestPreload(`/assets/sprites/projectile_${style}.json`, `projectile_${style}`)
}

export class ProjectileEl extends GameEntityEl {
	constructor(proj: Projectile) {
		super(proj)
		const spritesheet = Assets.get<Spritesheet>(`projectile_${proj.options.style}`)
		if (!spritesheet) {
			throw new Error('The man spritesheet has not been loaded')
		}
		const sprite = new AnimatedSprite(spritesheet.animations.default!)
		this.addChild(sprite)
	}
}
