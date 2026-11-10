import { WithManSprite } from '#lib/scripts/pixi/entities/withManSprite.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Princess } from '#lib/scripts/game/entities/princess.ts'
import { spiralSpawnAnimation } from '#lib/scripts/pixi/vfx/spiralSpawnAnimation.ts'

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
		princess.rescued.listen(() => {
			gc.addAnimation(
				spiralSpawnAnimation({
					targetPosition: princess.xy,
					color: 'hotpink',
				}),
			)
			gc.addAnimation(
				spiralSpawnAnimation({
					targetPosition: {
						x: princess.x - 5,
						y: princess.y - 2,
					},
					color: 'cyan',
				}),
			)
		})
	}
}
