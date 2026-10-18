import { type ColorSource, Graphics, type Rectangle } from 'pixi.js'
import { XY } from '#lib/scripts/utils/XY.ts'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'

type FlyingSquare = {
	initialPosition: XY
	velocity: XY
}

export function destroyIntoSquaresAnimation(
	worldBounds: Rectangle,
	color: ColorSource,
	x = 2,
	y = 2,
) {
	const gfx = new Graphics()
	gfx.x = worldBounds.x - worldBounds.width / 2
	gfx.y = worldBounds.y - worldBounds.height / 2
	const size = { x: worldBounds.width / x, y: worldBounds.height / y }
	const INITIAL_SPEED = 100
	const GRAVITY = 250
	const squares: FlyingSquare[] = []
	for (let row = 0; row < y; row++) {
		for (let column = 0; column < x; column++) {
			squares.push({
				initialPosition: {
					x: column * size.x,
					y: row * size.y,
				},
				velocity: random(),
			})
		}
	}

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
				gfx.rect(pos.x, pos.y, size.x, size.y).fill(color)
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
