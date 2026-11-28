import { ManSprite } from '#lib/scripts/pixi/entities/manSprite.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Princess } from '#lib/scripts/game/entities/princess.ts'
import { spiralSpawnAnimation } from '#lib/scripts/pixi/vfx/spiralSpawnAnimation.ts'
import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'

export class PrincessEl extends GameEntityEl {
	private sprite: ManSprite
	constructor(
		gc: GameController,
		private princess: Princess,
	) {
		super(gc, princess)
		this.sprite = new ManSprite()
		this.sprite.setAnimation({
			frames: [0],
		})
		this.sprite.tint = 'hotpink'
		princess.rescued.listen(() => {
			gc.addAnimation(
				spiralSpawnAnimation({
					targetPosition: princess.xy,
					color: 'hotpink',
					waveDuration: 2.5,
				}),
			)
			gc.addAnimation(
				spiralSpawnAnimation({
					targetPosition: gc.game?.level?.player.xy ?? princess.xy,
					color: 'cyan',
					waveDuration: 2.5,
				}),
			)
		})
	}
}
