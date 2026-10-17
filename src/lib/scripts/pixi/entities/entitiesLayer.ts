import { Container } from 'pixi.js'
import type { Game } from '#lib/scripts/game/game.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export class EntitiesLayer extends Container {
	onScreen: Map<GameEntity, Container> = new Map()
	constructor(private game: Game) {
		super()
	}
	update(){

	}
}
