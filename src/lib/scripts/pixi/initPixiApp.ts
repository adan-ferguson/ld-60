import { Application, TextureStyle } from 'pixi.js'
import { initDevtools } from '@pixi/devtools'
import { Consts } from '#lib/scripts/consts.ts'

let app: Application | null = null

const BASE_WIDTH = Math.round(Consts.TILES_X * Consts.TILE_SIZE_PX)
const BASE_HEIGHT = Math.round(Consts.TILES_Y * Consts.TILE_SIZE_PX)

TextureStyle.defaultOptions.scaleMode = 'nearest'

export async function initPixiApp(
	canvas: HTMLCanvasElement,
	options: Parameters<Application['init']>[0] = {},
) {
	if (app) {
		app.destroy()
	}
	app = new Application()
	await app.init({
		width: BASE_WIDTH,
		height: BASE_HEIGHT,
		resolution: 1,
		autoDensity: false,
		antialias: false,
		canvas,
		powerPreference: 'high-performance',
		...options,
		roundPixels: true,
	})
	await initDevtools({ app })
	return app
}
