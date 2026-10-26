import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Turret } from '#lib/scripts/game/entities/turret.ts'
import { Graphics } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'
import { destroyIntoSquaresAnimation } from '#lib/scripts/pixi/vfx/destroyIntoSquaresAnimation.ts'

export class TurretEl extends GameEntityEl {
	private gfx: Graphics
	constructor(
		gc: GameController,
		private turret: Turret,
	) {
		super(gc, turret)
		this.gfx = new Graphics()
		this.addChild(this.gfx)
		turret.destroyed.listen(() => {
			gc.addAnimation(destroyIntoSquaresAnimation(turret.worldBounds, 'magenta'))
		})
	}
	update2() {
		this.gfx.clear()
		this.gfx
			.rect(-this.turret.w / 2, -this.turret.h / 2, this.turret.w, this.turret.h)
			.fill('magenta')
		let color = 'black'
		if (this.turret.fireTimeout) {
			color = this.turret.fireTimeout % 0.16 < 0.08 ? 'red' : 'black'
		}
		this.gfx.rect(-2, -1, 4, 2).fill(color)
		this.gfx.rect(-1, -2, 2, 4).fill(color)
	}
}
