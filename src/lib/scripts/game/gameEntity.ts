import type { Game } from '#lib/scripts/game/game.ts'
import type { Container } from 'pixi.js'

export abstract class GameEntity {
	public isActive = false
	protected constructor(protected game: Game) {}
	public abstract update(deltaMS: number): void
	public abstract createPixiEl(): Container
}
