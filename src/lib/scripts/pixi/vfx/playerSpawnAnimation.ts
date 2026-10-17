import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { Graphics } from 'pixi.js'
import { Consts } from '#lib/scripts/consts.ts'

type Options = {
	onFinished: () => void
	targetPosition: XY
}

const r = Math.round
const DIAMOND_COUNT = 8
const DIAMOND_RADIUS = 4
const DIAMOND_ROTATION = Math.PI

export function playerSpawnAnimation(options: Options) {
	const gfx = new Graphics()
	const targetXY = options.targetPosition
	gfx.x = Consts.GAME_WIDTH / 2
	gfx.y = Consts.GAME_HEIGHT / 2
	return new VfxAnimation(gfx, {
		finished: options.onFinished,
		duration: 1.5,
		draw: (t: number) => {
			t = easeOutQuad(t)
			const radius = lerp(Consts.GAME_HEIGHT / 2, 0, t)
			gfx.clear()
			gfx.x = r(lerp(Consts.GAME_WIDTH / 2, targetXY.x, t))
			gfx.y = r(lerp(Consts.GAME_HEIGHT / 2, targetXY.y, t))
			for (let i = 0; i < DIAMOND_COUNT; i++) {
				const angle = (Math.PI * 2 * i) / DIAMOND_COUNT + t * DIAMOND_ROTATION
				const x = Math.round(Math.cos(angle) * radius)
				const y = Math.round(Math.sin(angle) * radius)
				gfx
					.poly([
						{ x: x - DIAMOND_RADIUS, y },
						{ x, y: y - DIAMOND_RADIUS },
						{ x: x + DIAMOND_RADIUS, y },
						{ x, y: y + DIAMOND_RADIUS },
					])
					.fill('cyan')
			}
		},
	})
}

function lerp(from: number, to: number, t: number) {
	return from + (to - from) * t
}

function easeOutQuad(t: number) {
	const inverse = 1 - t
	return 1 - inverse * inverse
}
