import { Application, TextureStyle } from 'pixi.js'
import { initDevtools } from '@pixi/devtools'
import { Consts } from '#lib/scripts/consts.ts'

let app: Application | null = null

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
		width: Consts.GAME_WIDTH,
		height: Consts.GAME_HEIGHT,
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
