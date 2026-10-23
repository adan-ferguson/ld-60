import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { Assets, Container, Graphics, Sprite } from 'pixi.js'
import { Consts } from '#lib/scripts/consts.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

type Options = {
	onFinished: () => void
	targetPosition: XY
}

const r = Math.round
const SHAPE_COUNT = 8
const SHAPE_ROTATION = Math.PI * 2

AssetUtils.requestPreload({
	src: `/assets/sprites/x.png`,
	alias: `x`,
})

export function playerSpawnAnimation(options: Options) {
	const container = new Container()
	const targetXY = options.targetPosition
	container.x = Consts.GAME_WIDTH / 2
	container.y = Consts.GAME_HEIGHT / 2
	const sprites = Array.from({ length: SHAPE_COUNT }, (_, i) => {
		return new Sprite({
			texture: Assets.get('x'),
			anchor: {
				x: 0.5,
				y: 0.5,
			},
		})
	})
	sprites.forEach((s) => container.addChild(s))
	return new VfxAnimation(container, {
		finished: () => {
			options.onFinished()
		},
		duration: 1.5,
		draw: (t: number) => {
			t = easeOutQuad(t)
			const radius = lerp(Consts.GAME_HEIGHT / 2, 0, t)
			container.x = r(lerp(Consts.GAME_WIDTH / 2, targetXY.x, t))
			container.y = r(lerp(Consts.GAME_HEIGHT / 2, targetXY.y, t))
			for (let i = 0; i < SHAPE_COUNT; i++) {
				const angle = (Math.PI * 2 * i) / SHAPE_COUNT + t * SHAPE_ROTATION
				const x = Math.round(Math.cos(angle) * radius)
				const y = Math.round(Math.sin(angle) * radius)
				sprites[i]!.x = x
				sprites[i]!.y = y
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
