import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameEntityEl } from '../pixi/entities/gameEntityEl'
import { ProjectileEl } from '#lib/scripts/pixi/entities/projectileEl.ts'
import Game from '#lib/scripts/game/game.ts'
import type { ColorSource } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'
import { Player } from '#lib/scripts/game/player/player.ts'
import { Enemy } from '#lib/scripts/game/entities/enemy.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'

export type ProjectileStyle = 'small' | 'large' | 'dot'

type Options = {
	style: ProjectileStyle
	hitbox: XY
	wallHitbox: XY
	source: GameEntity
	lifetime: number
	x: number
	y: number
	velX: number
	velY: number
	angle: number
	tint: ColorSource
}

export class Projectile extends GameEntity {
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
			this.destroy('lifetime')
		}
		if (this.options.source instanceof Player) {
			const target = this.game.entitiesManager.activeEntities.find(
				(ent) => ent.canBeHitByPlayer && ent.worldBounds.intersects(this.worldBounds),
			)
			if (target) {
				target.takeDamage(1)
				this.destroy('hit')
			}
		} else if (this.options.source instanceof Enemy) {
			const { player } = this.game
			if (player && player.isReady && player.worldBounds.intersects(this.worldBounds)) {
				player.takeDamage(1)
				this.destroy('hit')
			}
		}
		// Player projectiles have a bit more leeway to avoid walls
		const myWallCollisionBounds = CoolRect.fromMidpointCoords({
			x: this.x,
			y: this.y,
			width: this.options.wallHitbox.x,
			height: this.options.wallHitbox.y,
		})
		if (
			this.game.worldCollision.projectileBlockers.some((pb) => pb.intersects(myWallCollisionBounds))
		) {
			this.destroy('hit')
		}
	}
	public createPixiEl(gc: GameController): GameEntityEl {
		return new ProjectileEl(gc, this)
	}
	public get w(): number {
		return this.options.hitbox.x
	}
	public get h(): number {
		return this.options.hitbox.y
	}
}
