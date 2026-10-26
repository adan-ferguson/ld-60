import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import Game from '#lib/scripts/game/game.ts'
import { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export type EnemyKind = 'turret' | 'man'

export abstract class Enemy extends GameEntity {
	constructor(game: Game, tileXY: XY) {
		super(game)
		this.setTileXY(tileXY)
		this.destroyed.listen(() => {
			game.addScore(this.score, this)
		})
	}
	abstract get score(): number
}
