import { type ColorSource, Graphics } from 'pixi.js'
import { XY } from '#lib/scripts/utils/XY.ts'
import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import type CoolRect from '#lib/scripts/utils/coolRect.ts'

type FlyingSquare = {
	initialPosition: XY
	velocity: XY
}

export function particlesAnimation(
	worldBounds: CoolRect,
	color: ColorSource,
	size: number,
	count: number,
) {
	const gfx = new Graphics()
	gfx.x = worldBounds.x - worldBounds.width / 2
	gfx.y = worldBounds.y - worldBounds.height / 2
	const INITIAL_SPEED = 100
	const GRAVITY = 250
	const squares: FlyingSquare[] = []
	for (let i = 0; i < count; i++) {
		squares.push({
			initialPosition: {
				x: Math.random() * (worldBounds.width - size),
				y: Math.random() * (worldBounds.height - size),
			},
			velocity: randomVel(),
		})
	}

	return new VfxAnimation(gfx, {
		duration: 1,
		update: ({ t }) => {
			gfx.clear()
			gfx.alpha = 1 - t
			for (const square of squares) {
				const pos: XY = XY.sum(square.initialPosition, XY.scale(square.velocity, t), {
					x: 0,
					y: 0.5 * GRAVITY * t * t,
				})
				gfx.rect(pos.x, pos.y, size, size).fill(color)
			}
		},
	})

	function randomVel() {
		const angle = -Math.random() * Math.PI
		const speed = INITIAL_SPEED * (0.5 + Math.random() * 0.5)
		return {
			x: speed * Math.cos(angle),
			y: speed * Math.sin(angle),
		}
	}
}
