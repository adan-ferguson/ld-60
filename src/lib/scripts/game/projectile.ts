import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameEntityEl } from '../pixi/entities/gameEntityEl'
import { ProjectileEl } from '#lib/scripts/pixi/entities/projectileEl.ts'
import type { Game } from '#lib/scripts/game/game.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

export type ProjectileStyle = 'small' | 'large'

type Options = {
	style: ProjectileStyle
	size: number
	source: 'player' | 'enemy'
	lifetime: number
	velocity: XY
}

export class Projectile extends GameEntity {
	constructor(
		game: Game,
		public options: Options,
	) {
		super(game)
	}
	public update2(): void {
		// TODO: check for collisions
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
