import { Application, TextureStyle } from 'pixi.js'
import { initDevtools } from '@pixi/devtools'

let app: Application | null = null

const BASE_WIDTH = 320
const BASE_HEIGHT = 180

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
