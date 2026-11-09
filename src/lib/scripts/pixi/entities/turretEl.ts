import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Turret } from '#lib/scripts/game/entities/turret.ts'
import { Graphics } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'
import { particlesAnimation } from '#lib/scripts/pixi/vfx/particlesAnimation.ts'

const DAMAGE_FLASH_TIME = 0.1

export class TurretEl extends GameEntityEl {
	private gfx: Graphics
	#flashTime = 0
	constructor(
		gc: GameController,
		private turret: Turret,
	) {
		super(gc, turret)
		this.gfx = new Graphics()
		this.addChild(this.gfx)
		turret.destroyed.listen(() => {
			gc.addAnimation(particlesAnimation(turret.worldBounds, turret.color, 3, 6))
		})
		turret.damageTaken.listen(() => {
			this.#flashTime = DAMAGE_FLASH_TIME
		})
	}
	update2(delta: number) {
		this.gfx.clear()
		this.gfx
			.rect(
				-this.turret.baseWidth / 2,
				-this.turret.baseHeight / 2,
				this.turret.baseWidth,
				this.turret.baseHeight,
			)
			.fill(this.#flashTime > 0 ? 'white' : this.turret.color)
		let color = 'black'
		if (this.turret.fireTimeout) {
			color = this.turret.fireTimeout % 0.16 < 0.08 ? 'red' : 'black'
		}
		this.gfx.rect(-2, -1, 4, 2).fill(color)
		this.gfx.rect(-1, -2, 2, 4).fill(color)
		this.#flashTime = Math.max(0, this.#flashTime - delta)
	}
}
