import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import { isSquished } from '#lib/scripts/game/collisions/isSquished.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { SfxPlayer } from '#lib/scripts/audio/sfxPlayer.ts'

export abstract class GameEntity {
	damageTaken = CoolEvents.createHandler<(amount: number) => void>()
	isDestroyed = false
	isReady = true
	x = 0
	y = 0
	velX = 0
	velY = 0
	facing = 1
	time = 0
	scale = 1
	#damageTaken = 0
	constructor(public level: LevelInstance) {}
	get game() {
		return this.level.game
	}
	get health() {
		return this.maxHealth - this.#damageTaken
	}
	get panPosition() {
		const halfWidth = Consts.GAME_WIDTH / 2
		return Math.max(-1, Math.min(1, (this.x - halfWidth) / halfWidth))
	}
	abstract update2(delta: number): void
	abstract createPixiEl(gc: GameController): GameEntityEl
	abstract get baseWidth(): number
	abstract get baseHeight(): number

	/**
	 * @virtual
	 */
	get hazardHurtbox(): false | CoolRect {
		return false
	}

	/**
	 * @virtual
	 */
	get canBeHitByPlayer() {
		return false
	}

	/**
	 * @virtual
	 */
	async animateSpawn() {}

	/**
	 * @virtual
	 */
	get squishable() {
		return false
	}

	/**
	 * @virtual
	 */
	get canStandOnMovingBlocks() {
		return false
	}

	/**
	 * Set our XY with the tileXY so the have the same X midpoint and Y bottom
	 * @param tileXY
	 */
	setTileXY(tileXY: XY) {
		const worldXY = TileDef.toWorldRect(tileXY)
		this.x = worldXY.midpoint.x
		this.y = worldXY.bottom - this.height / 2
	}

	/**
	 * @virtual
	 */
	get blocksMovement() {
		return false
	}

	/**
	 * @virtual
	 */
	get blocksProjectiles() {
		return false
	}

	/**
	 * @virtual
	 */
	get isHazard() {
		return false
	}

	destroyed = CoolEvents.createHandler<(reason: string) => void>()
	get isActive() {
		return this.isReady && !this.isDestroyed
	}
	get maxHealth(): number {
		return 1
	}

	get localBounds(): CoolRect {
		return new CoolRect().pad({
			x: this.baseWidth / 2,
			y: this.baseHeight / 2,
		})
	}

	get worldBounds(): CoolRect {
		return this.toWorldBounds(this.localBounds)
	}

	toWorldBounds(localBounds: CoolRect): CoolRect {
		return new CoolRect({
			x: this.x + localBounds.x * this.scale,
			y: this.y + localBounds.y * this.scale,
			width: localBounds.width * this.scale,
			height: localBounds.height * this.scale,
		})
	}

	get xy() {
		return { x: this.x, y: this.y }
	}

	set xy(val: XY) {
		this.x = val.x
		this.y = val.y
	}

	get height() {
		return this.baseHeight * this.scale
	}

	get width() {
		return this.baseWidth * this.scale
	}

	set left(val: number) {
		this.x = val + this.width / 2
	}

	set right(val: number) {
		this.x = val - this.width / 2
	}

	update(delta: number) {
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
		const { hazardHurtbox } = this
		if (!hazardHurtbox) {
			return
		}
		const hazardHurtboxWorld = this.toWorldBounds(hazardHurtbox)
		if (this.level.worldCollision.hazards.some((h) => h.intersects(hazardHurtboxWorld))) {
			this.takeDamage(this.maxHealth)
		}
	}

	protected move(delta: number) {
		this.x += this.velX * delta
		this.y += this.velY * delta
	}

	takeDamage(amount: number) {
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

	destroy(reason: string = '') {
		this.destroyed.emit(reason)
		this.isDestroyed = true
	}

	playSfx(sfxName: Parameters<typeof SfxPlayer.play>[0]) {
		SfxPlayer.play(sfxName, this.panPosition)
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
