import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

type Options = {
	onFinished: () => void
	position: XY
}

export function playerSpawnAnimation(options: Options) {
	const anim = new VfxAnimation({
		finished: options.onFinished,
		durationMS: 1500,
		draw: (t: number) => {
			// Draw the anim here
		},
	})
	return anim
}
