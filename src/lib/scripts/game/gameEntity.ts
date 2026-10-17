import type { Game } from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { Rectangle } from 'pixi.js'

export abstract class GameEntity {
	public isActive = false
	public x: number = 0
	public y: number = 0
	public velX: number = 0
	public velY: number = 0
	public facing: number = 1
	protected constructor(protected game: Game) {}
	public abstract update2(delta: number): void
	public abstract createPixiEl(): GameEntityEl
	public abstract get width(): number
	public abstract get height(): number

	public get worldBounds(): Rectangle {
		return new Rectangle(
			this.localBounds.x + this.x,
			this.localBounds.y + this.y,
			this.localBounds.width,
			this.localBounds.height,
		)
	}

	public get localBounds(): Rectangle {
		return new Rectangle(-this.width / 2, -this.height / 2, this.width, this.height)
	}

	public set position(val: XY) {
		this.x = val.x
		this.y = val.y
	}

	public update(delta: number) {
		this.update2(delta)
		this.move(delta)
	}

	protected move(delta: number) {
		this.x += this.velX * delta
		this.y += this.velY * delta
	}
}
