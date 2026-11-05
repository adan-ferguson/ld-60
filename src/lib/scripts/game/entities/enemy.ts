import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'

export abstract class Enemy extends GameEntity {
	constructor(level: LevelInstance) {
		super(level)
		this.destroyed.listen(() => {
			level.game.addScore(this.score, this)
		})
	}
	override get canBeHitByPlayer() {
		return true
	}
	abstract get score(): number
	hasGroundAhead(): boolean {
		const bounds = this.worldBounds
		const LEDGE_LOOKAHEAD = -2
		const x = this.facing > 0 ? bounds.right + LEDGE_LOOKAHEAD : bounds.x - LEDGE_LOOKAHEAD
		return this.level.worldCollision.isGrounded(
			new CoolRect({
				x,
				y: bounds.bottom,
				width: 0.1,
				height: 0,
			}),
		)
	}
}
