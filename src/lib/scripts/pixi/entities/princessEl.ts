import { WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Princess } from '#lib/scripts/game/entities/princess.ts'

export class PrincessEl extends WithManSprite {
	constructor(
		gc: GameController,
		private princess: Princess,
	) {
		super(gc, princess)
		this.setAnimation({
			frames: [0],
		})
		this.sprite.tint = 'hotpink'
	}
}
