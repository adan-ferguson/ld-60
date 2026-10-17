import type { Game } from '#lib/scripts/game/game.ts'
import type { Container } from 'pixi.js'

export abstract class GameEntity {
	public pixiElement: Container | undefined
	protected constructor(protected game: Game) {}
	public abstract update(deltaMS: number): void
}
