import Game from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import { isSquished } from '#lib/scripts/game/collisions/isSquished.ts'

export abstract class GameEntity {
	public isDestroyed = false
	public isReady = false
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

	/**
	 * @virtual
	 */
	public get diesToHazards() {
		return false
	}

	/**
	 * @virtual
	 */
	public get canBeHitByPlayer() {
		return false
	}

	/**
	 * @virtual
	 */
	public async animateSpawn() {}

	/**
	 * @virtual
	 */
	public get squishable() {
		return false
	}

	/**
	 * @virtual
	 */
	public get canStandOnMovingBlocks() {
		return false
	}

	public setTileXY(tileXY: XY) {
		const worldXY = TileDef.toWorldMidpoint(tileXY)
		this.x = worldXY.x
		this.y = worldXY.y
	}

	/**
	 * @virtual
	 */
	public get blocksMovement() {
		return false
	}

	/**
	 * @virtual
	 */
	public get blocksProjectiles() {
		return false
	}

	/**
	 * @virtual
	 */
	public get isHazard() {
		return false
	}

	public destroyed = CoolEvents.createHandler<(reason: string) => void>()
	public get maxHealth(): number {
		return 1
	}

	public get localBounds(): CoolRect {
		return new CoolRect().pad({ x: this.w / 2, y: this.h / 2 })
	}

	public get worldBounds(): CoolRect {
		return this.toWorldBounds(this.localBounds)
	}

	public toWorldBounds(localBounds: CoolRect): CoolRect {
		return localBounds.shift({ x: this.x, y: this.y })
	}

	public get xy() {
		return { x: this.x, y: this.y }
	}

	public set xy(val: XY) {
		this.x = val.x
		this.y = val.y
	}

	public set left(val: number) {
		this.x = val + this.w / 2
	}

	public set right(val: number) {
		this.x = val - this.w / 2
	}

	public update(delta: number) {
		this.time += delta
		if (this.isDestroyed) {
			return
		}
		this.update2(delta)
		if (this.isReady) {
			if (this.isSquished()) {
				this.takeDamage(this.maxHealth)
				return
			}
			this.move(delta)
			this.checkHazards()
		}
	}

	private checkHazards() {
		if (!this.diesToHazards) {
			return
		}
		const hazardHurtbox = this.worldBounds.pad(-1)
		if (this.game.worldCollision.hazards.some((h) => h.intersects(hazardHurtbox))) {
			this.takeDamage(this.maxHealth)
		}
	}

	protected move(delta: number) {
		this.x += this.velX * delta
		this.y += this.velY * delta
	}

	public takeDamage(amount: number) {
		if (this.isDestroyed || !this.isReady) {
			return
		}
		this.damageTaken += amount
		if (this.damageTaken >= this.maxHealth) {
			this.destroy()
		}
	}

	public destroy(reason: string = '') {
		this.destroyed.emit(reason)
		this.isDestroyed = true
	}

	/**
	 * @virtual
	 */
	protected isSquished(): boolean {
		if (!this.squishable) {
			return false
		}
		const solids = this.game.worldCollision.movementBlockers.map((s) => s.rect)
		return isSquished(this.worldBounds, solids)
	}
}
