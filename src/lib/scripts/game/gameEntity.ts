import type { Game } from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

export abstract class GameEntity {
	public isActive = false
	public x: number = 0
	public y: number = 0
	public velX: number = 0
	public velY: number = 0
	protected constructor(protected game: Game) {}
	public abstract update2(deltaMS: number): void
	public abstract createPixiEl(): GameEntityEl

	public set position(val: XY) {
		this.x = val.x
		this.y = val.y
	}

	public update(deltaMS: number) {
		this.update2(deltaMS)
		this.x = Math.round(this.x + this.velX * (deltaMS / 1000))
		this.y = Math.round(this.y + this.velY * (deltaMS / 1000))
	}
}
