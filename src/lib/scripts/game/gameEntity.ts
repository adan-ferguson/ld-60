import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { Rectangle } from 'pixi.js'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { GameController } from '#lib/scripts/gameController.ts'

export abstract class GameEntity {
	public isActive = true
	public x = 0
	public y = 0
	public velX = 0
	public velY = 0
	public facing = 1
	public time = 0
	private damageTaken = 0
	protected constructor(protected game: Game) {}
	public abstract update2(delta: number): void
	public abstract createPixiEl(gc: GameController): GameEntityEl
	protected abstract get width(): number
	protected abstract get height(): number
	public destroyed = CoolEvents.createHandler()
	public get maxHealth(): number {
		return 1
	}

	public get localBounds(): Rectangle {
		return new Rectangle(-this.width / 2, -this.height / 2, this.width, this.height)
	}

	public get worldBounds(): Rectangle {
		return this.toWorldBounds(this.localBounds)
	}

	public toWorldBounds(localBounds: Rectangle): Rectangle {
		return new Rectangle(
			localBounds.x + this.x,
			localBounds.y + this.y,
			localBounds.width,
			localBounds.height,
		)
	}

	public set position(val: XY) {
		this.x = val.x
		this.y = val.y
	}

	public update(delta: number) {
		this.time += delta
		if (!this.isActive) {
			return
		}
		this.update2(delta)
		this.move(delta)
		this.checkHazards()
	}

	protected checkHazards() {
		const terrainCollision = this.game.level?.terrainCollision
		if (!terrainCollision || !this.isActive) {
			return
		}
		if (terrainCollision.overlapsLava({ x: this.x, y: this.y, width: 0, height: 0 })) {
			this.takeDamage(this.maxHealth)
		}
	}

	protected move(delta: number) {
		this.x += this.velX * delta
		this.y += this.velY * delta
	}

	public takeDamage(amount: number) {
		if (!this.isActive) {
			return
		}
		this.damageTaken += amount
		if (this.damageTaken >= this.maxHealth) {
			this.destroyed.emit()
			this.isActive = false
		}
	}

	public angleTo(entity: GameEntity): number {
		const dx = entity.x - this.x
		const dy = entity.y - this.y
		return Math.atan2(dy, dx)
	}
}
