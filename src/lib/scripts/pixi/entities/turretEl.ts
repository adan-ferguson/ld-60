import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Turret } from '#lib/scripts/game/enemies/turret.ts'
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
	draw() {
		this.gfx.clear()
		this.gfx
			.rect(-this.turret.width / 2, -this.turret.height / 2, this.turret.width, this.turret.height)
			.fill('magenta')
		let color = 'black'
		if (this.turret.fireTimeout) {
			color = this.turret.fireTimeout % 0.16 < 0.08 ? 'red' : 'black'
		}
		this.gfx.rect(-2, -1, 4, 2).fill(color)
		this.gfx.rect(-1, -2, 2, 4).fill(color)
	}
}
