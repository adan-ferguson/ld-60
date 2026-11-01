import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { GameController } from '#lib/scripts/gameController.ts'
import type { Phanta } from '#lib/scripts/game/entities/phanta.ts'

export class PhantaEl extends GameEntityEl {
	constructor(gc: GameController, phanta: Phanta) {
		super(gc, phanta)
		phanta.destroyed.listen(() => {
			// TODO: fly away from the screen with some particles,
			// entities layer, so we'll have to animate the fade out in the vfx layer
		})
	}
}
