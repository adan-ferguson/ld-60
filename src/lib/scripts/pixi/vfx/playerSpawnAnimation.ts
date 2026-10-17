import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { Graphics } from 'pixi.js'
import { Consts } from '#lib/scripts/consts.ts'

type Options = {
	onFinished: () => void
	targetPosition: XY
}

export function playerSpawnAnimation(options: Options) {
	const gfx = new Graphics()
	const targetXY = XY.scale(options.targetPosition, Consts.TILE_SIZE_PX)
	gfx.x = Consts.GAME_WIDTH / 2
	gfx.y = Consts.GAME_HEIGHT / 2
	return new VfxAnimation(gfx, {
		finished: options.onFinished,
		durationMS: 1500,
		draw: (t: number) => {
			gfx.clear()
			gfx.x = lerp(Consts.GAME_WIDTH / 2, targetXY.x, t)
			gfx.y = lerp(Consts.GAME_HEIGHT / 2, targetXY.y, t)
			gfx.circle(0, 0, lerp(Consts.GAME_HEIGHT / 2, 0, t)).stroke({
				width: 5,
				color: 'cyan',
			})
		},
	})
}

function lerp(from: number, to: number, t: number) {
	return from + (to - from) * t
}
