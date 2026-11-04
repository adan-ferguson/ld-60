import { VfxAnimation } from '#lib/scripts/pixi/vfx/vfxAnimation.ts'
import { XY } from '#lib/scripts/utils/XY.ts'
import { Assets, Container, Sprite } from 'pixi.js'
import { Consts } from '#lib/scripts/consts.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

type Options = {
	onFinished: () => void
	targetPosition: XY
	waves: number
	waveDuration: number
	waveTimeOffset: number
	shapeCount: number
	rotationSpeed: number
	color: string
}

const r = Math.round

AssetUtils.requestPreload({
	src: `/assets/sprites/x.png`,
	alias: `x`,
})

export function spiralSpawnAnimation(options: Partial<Options>) {
	const o: Options = {
		onFinished: () => {},
		targetPosition: { x: 0, y: 0 },
		waves: 8,
		shapeCount: 8,
		rotationSpeed: Math.PI * 2,
		waveDuration: 1.5,
		waveTimeOffset: 0.05,
		color: 'white',
		...options,
	}
	const {
		onFinished,
		targetPosition,
		waves,
		waveDuration,
		waveTimeOffset,
		color,
		shapeCount,
		rotationSpeed,
	} = o
	const container = new Container()
	const targetXY = targetPosition
	container.x = Consts.GAME_WIDTH / 2
	container.y = Consts.GAME_HEIGHT / 2

	const allSprites = Array.from({ length: shapeCount * waves }, () => {
		return new Sprite({
			texture: Assets.get('x'),
			tint: color,
			anchor: {
				x: 0.5,
				y: 0.5,
			},
		})
	})

	return new VfxAnimation(container, {
		finished: () => {
			onFinished()
		},
		duration: waveDuration + waveTimeOffset * (waves - 1),
		update: ({ time }) => {
			for (let i = 0; i < waves; i++) {
				const start = i * waveTimeOffset
				const t = (time - start) / waveDuration
				const sprites = allSprites.slice(i * shapeCount, (i + 1) * shapeCount)
				if (t < 0 || t > 1) {
					sprites.forEach((s) => (s.visible = false))
					continue
				}
				sprites.forEach((s) => (s.visible = true))
				const easedT = easeOutQuad(t)
				const radius = lerp(Consts.GAME_HEIGHT / 2, 0, easedT)
				container.x = r(lerp(Consts.GAME_WIDTH / 2, targetXY.x, easedT))
				container.y = r(lerp(Consts.GAME_HEIGHT / 2, targetXY.y, easedT))
				for (let i = 0; i < shapeCount; i++) {
					const angle = (Math.PI * 2 * i) / shapeCount + t * rotationSpeed
					const x = Math.round(Math.cos(angle) * radius)
					const y = Math.round(Math.sin(angle) * radius)
					sprites[i]!.x = x
					sprites[i]!.y = y
				}
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
