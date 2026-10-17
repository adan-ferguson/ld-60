import { Container } from 'pixi.js'

export abstract class GameEntityEl extends Container {
	public abstract update(): void
}
