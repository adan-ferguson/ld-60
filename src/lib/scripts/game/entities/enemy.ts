import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import Game from '#lib/scripts/game/game.ts'
import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'

export type EnemyKind = 'turret' | 'runnerMan'

export abstract class Enemy extends GameEntity {
	constructor(game: Game, tileXY: XY) {
		super(game)
		this.setTileXY(tileXY)
		this.destroyed.listen(() => {
			game.addScore(this.score, this)
		})
	}
	abstract get score(): number
	hasGroundAhead(): boolean {
		const bounds = this.worldBounds
		const LEDGE_LOOKAHEAD = 0.5
		const x = this.facing > 0 ? bounds.right + LEDGE_LOOKAHEAD : bounds.x - LEDGE_LOOKAHEAD
		return this.game.worldCollision.isGrounded(
			new CoolRect({
				x,
				y: bounds.bottom,
				width: 0.1,
				height: 0,
			}),
		)
	}
}
