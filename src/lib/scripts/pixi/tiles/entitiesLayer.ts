import { Container } from 'pixi.js'
import type { Game } from '#lib/scripts/game/game.ts'

export class EntitiesLayer extends Container {
	constructor(private game: Game) {}
	update(deltaMS: number) {}
}
