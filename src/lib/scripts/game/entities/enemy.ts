import { GameEntity } from '#lib/scripts/game/gameEntity.ts'
import CoolRect from '#lib/scripts/utils/coolRect.ts'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import type { ColorSource } from 'pixi.js'
import { clamp } from '#lib/scripts/utils/clamp.ts'
import { formatHex, interpolate } from 'culori'

const ONE_HEALTH_COLOR = 'magenta'
const MULTI_HEALTH_COLOR = 'purple'
const ptm = interpolate([ONE_HEALTH_COLOR, MULTI_HEALTH_COLOR])

export abstract class Enemy extends GameEntity {
	flashInterval = 0
	constructor(level: LevelInstance) {
		super(level)
		this.destroyed.listen(() => {
			level.game.addScore(this.score, this)
		})
	}
	get color() {
		return pctToColor((this.health - 1) / this.maxHealth)
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
	return formatHex(ptm(clamp(pct, 0, 1)))
}
