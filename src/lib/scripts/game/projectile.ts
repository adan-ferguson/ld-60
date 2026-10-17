import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameEntityEl } from '../pixi/entities/gameEntityEl'
import { ProjectileEl } from '#lib/scripts/pixi/entities/projectileEl.ts'
import type { Game } from '#lib/scripts/game/game.ts'

export type ProjectileStyle = 'small' | 'large'

type Options = {
	style: ProjectileStyle
	size: number
	source: 'player' | 'enemy'
	lifetime: number
	x: number
	y: number
	velX: number
	velY: number
}

export class Projectile extends GameEntity {
	private time = 0
	constructor(
		game: Game,
		public options: Options,
	) {
		super(game)
		this.x = options.x
		this.y = options.y
		this.velX = options.velX
		this.velY = options.velY
	}
	public update2(delta: number) {
		this.time += delta
		if (this.time > this.options.lifetime) {
			this.isActive = false
		}
	}
	public createPixiEl(): GameEntityEl {
		return new ProjectileEl(this)
	}
	public get width(): number {
		return this.options.size
	}
	public get height(): number {
		return this.options.size
	}
}
