import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import Game from '#lib/scripts/game/game.ts'
import { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export type EnemyType = 'turret' | 'man'

export type EnemySpawnDef = {
	tileXY: XY
	enemyType: EnemyType
}

export abstract class Enemy extends GameEntity {
	constructor(game: Game, tileXY: XY) {
		super(game)
		const worldXY = TileDef.toWorldXY(tileXY)
		this.x = worldXY.x
		this.y = worldXY.y
		this.destroyed.listen(() => {
			game.score += this.score
		})
	}
	abstract get score(): number
}
