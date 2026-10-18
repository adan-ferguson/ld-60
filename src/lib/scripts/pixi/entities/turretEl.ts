import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Turret } from '#lib/scripts/game/enemies/turret.ts'
import { Graphics } from 'pixi.js'

export class TurretEl extends GameEntityEl {
	constructor(turret: Turret) {
		super(turret)
		const gfx = new Graphics()
		gfx.rect(-turret.width / 2, -turret.height / 2, turret.width, turret.height).fill('red')
		gfx.circle(0, 0, 2).fill('black')
		this.addChild(gfx)
	}
}
