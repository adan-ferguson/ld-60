import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import { isSquished } from '#lib/scripts/game/collisions/isSquished.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

export abstract class GameEntity {
	public damageTaken = CoolEvents.createHandler<(amount: number) => void>()
	public isDestroyed = false
	public isReady = true
	public x = 0
	public y = 0
	public velX = 0
	public velY = 0
	public facing = 1
	public time = 0
	public scale = 1
	#damageTaken = 0
	constructor(public level: LevelInstance) {}
	public get game() {
		return this.level.game
	}
	public get health() {
		return this.maxHealth - this.#damageTaken
	}
	public abstract update2(delta: number): void
	public abstract createPixiEl(gc: GameController): GameEntityEl
	public abstract get baseWidth(): number
	public abstract get baseHeight(): number

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

	/**
	 * Set our XY with the tileXY so the have the same X midpoint and Y bottom
	 * @param tileXY
	 */
	public setTileXY(tileXY: XY) {
		const worldXY = TileDef.toWorldRect(tileXY)
		this.x = worldXY.midpoint.x
		this.y = worldXY.bottom - this.height / 2
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
	public get isActive() {
		return this.isReady && !this.isDestroyed
	}
	public get maxHealth(): number {
		return 1
	}

	public get localBounds(): CoolRect {
		return new CoolRect().pad({
			x: this.baseWidth / 2,
			y: this.baseHeight / 2,
		})
	}

	public get worldBounds(): CoolRect {
		return this.toWorldBounds(this.localBounds)
	}

	public toWorldBounds(localBounds: CoolRect): CoolRect {
		return new CoolRect({
			x: this.x + localBounds.x * this.scale,
			y: this.y + localBounds.y * this.scale,
			width: localBounds.width * this.scale,
			height: localBounds.height * this.scale,
		})
	}

	public get xy() {
		return { x: this.x, y: this.y }
	}

	public set xy(val: XY) {
		this.x = val.x
		this.y = val.y
	}

	public get height() {
		return this.baseHeight * this.scale
	}

	public get width() {
		return this.baseWidth * this.scale
	}

	public set left(val: number) {
		this.x = val + this.width / 2
	}

	public set right(val: number) {
		this.x = val - this.width / 2
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
		if (this.level.worldCollision.hazards.some((h) => h.intersects(hazardHurtbox))) {
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
		this.#damageTaken += amount
		if (this.#damageTaken >= this.maxHealth) {
			this.destroy()
		} else {
			this.damageTaken.emit(amount)
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
		return isSquished(this.worldBounds, this.level.worldCollision.movementBlockers)
	}
}
