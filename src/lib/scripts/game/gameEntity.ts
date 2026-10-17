import type { Game } from '#lib/scripts/game/game.ts'
import type { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

export abstract class GameEntity {
	public isActive = false
	public position: XY = { x: 0, y: 0 }
	protected constructor(protected game: Game) {}
	public abstract update(deltaMS: number): void
	public abstract createPixiEl(): GameEntityEl
}
