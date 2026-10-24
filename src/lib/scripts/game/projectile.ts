import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import type { GameEntityEl } from '../pixi/entities/gameEntityEl'
import { ProjectileEl } from '#lib/scripts/pixi/entities/projectileEl.ts'
import Game from '#lib/scripts/game/game.ts'
import type { ColorSource } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'

export type ProjectileStyle = 'small' | 'large' | 'dot'

type Options = {
	style: ProjectileStyle
	w: number
	h: number
	source: 'player' | 'enemy'
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
			this.isActive = false
		}
		if (this.options.source === 'player') {
			const target = this.game.entitiesManager.enemies.find((enemy) =>
				enemy.worldBounds.intersects(this.worldBounds),
			)
			if (target) {
				target.takeDamage(1)
				this.isActive = false
			}
		} else if (this.options.source === 'enemy') {
			if (this.game.player.isActive && this.game.player.worldBounds.intersects(this.worldBounds)) {
				this.game.player.takeDamage(1)
				this.isActive = false
			}
		}
		if (this.game.level?.terrainCollision.overlapsSolid(this.worldBounds)) {
			this.isActive = false
		}
	}
	public createPixiEl(gc: GameController): GameEntityEl {
		return new ProjectileEl(gc, this)
	}
	public get width(): number {
		return this.options.w
	}
	public get height(): number {
		return this.options.h
	}
}
