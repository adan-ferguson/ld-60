import { GameEntityEl } from '#lib/scripts/pixi/entities/gameEntityEl.ts'
import type { Turret } from '#lib/scripts/game/enemies/turret.ts'
import { Graphics, type Rectangle } from 'pixi.js'
import type { GameController } from '#lib/scripts/gameController.ts'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { XY } from '#lib/scripts/utils/XY.ts'

export class TurretEl extends GameEntityEl {
	constructor(gc: GameController, turret: Turret) {
		super(gc, turret)
		const gfx = new Graphics()
		gfx.rect(-turret.width / 2, -turret.height / 2, turret.width, turret.height).fill('red')
		gfx.circle(0, 0, 2).fill('black')
		this.addChild(gfx)
		turret.destroyed.listen(() => {
			gc.vfxLayer.addAnimation(destroyedAnimation(turret.worldBounds))
		})
	}
}

type FlyingSquare = {
	initialPosition: XY
	velocity: XY
}

function destroyedAnimation(worldBounds: Rectangle) {
	const gfx = new Graphics()
	gfx.x = worldBounds.x
	gfx.y = worldBounds.y
	const size = { x: worldBounds.width / 2, y: worldBounds.height / 2 }
	const INITIAL_SPEED = 100
	const GRAVITY = 250
	const squares: FlyingSquare[] = [
		{
			initialPosition: {
				x: -worldBounds.width / 4,
				y: -worldBounds.height / 4,
			},
			velocity: random(),
		},
		{
			initialPosition: {
				x: worldBounds.width / 4,
				y: -worldBounds.height / 4,
			},
			velocity: random(),
		},
		{
			initialPosition: {
				x: worldBounds.width / 4,
				y: worldBounds.height / 4,
			},
			velocity: random(),
		},
		{
			initialPosition: {
				x: -worldBounds.width / 4,
				y: worldBounds.height / 4,
			},
			velocity: random(),
		},
	]

	return new VfxAnimation(gfx, {
		duration: 1,
		draw: (t) => {
			gfx.clear()
			gfx.alpha = 1 - t
			for (const square of squares) {
				const pos: XY = XY.sum(square.initialPosition, XY.scale(square.velocity, t), {
					x: 0,
					y: 0.5 * GRAVITY * t * t,
				})
				gfx.rect(pos.x, pos.y, size.x, size.y).fill('red')
			}
		},
	})

	function random() {
		const angle = -Math.random() * Math.PI
		const speed = INITIAL_SPEED * (0.5 + Math.random() * 0.5)
		return {
			x: speed * Math.cos(angle),
			y: speed * Math.sin(angle),
		}
	}
}
