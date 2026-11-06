import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { ColorSource } from 'pixi.js'

const ONE_HEALTH_COLOR = 'magenta'
const MULTI_HEALTH_COLOR = 'purple'

export abstract class Enemy extends GameEntity {
	flashInterval = 0
	constructor(level: LevelInstance) {
		super(level)
		this.destroyed.listen(() => {
			level.game.addScore(this.score, this)
		})
	}
	override get color() {
		if (this.maxHealth === 1) {
			return ONE_HEALTH_COLOR
		}
		return pctToColor(this.health / this.maxHealth)
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

function pctToColor(pct: number): ColorSource {
	// TODO: This
}
