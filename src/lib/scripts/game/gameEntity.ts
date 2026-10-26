import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { Rectangle } from 'pixi.js'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'

export abstract class GameEntity {
	public isActive = true
	public x = 0
	public y = 0
	public velX = 0
	public velY = 0
	public facing = 1
	public time = 0
	private damageTaken = 0
	protected constructor(public game: Game) {}
	public abstract update2(delta: number): void
	public abstract createPixiEl(gc: GameController): GameEntityEl
	public abstract get w(): number
	public abstract get h(): number
	public get isSolid() {
		return false
	}
	public destroyed = CoolEvents.createHandler()
	public get maxHealth(): number {
		return 1
	}

	public get localBounds(): CoolRect {
		return new CoolRect().pad({ w: this.w, h: this.h })
	}

	public get worldBounds(): CoolRect {
		return this.toWorldBounds(this.localBounds)
	}

	public toWorldBounds(localBounds: CoolRect): CoolRect {
		return localBounds.shift({ x: this.x, y: this.y })
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
		if (!this.isActive) {
			return
		}
		if (this.game.terrainCollision.overlapsLava(new CoolRect({ x: this.x, y: this.y }))) {
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
