import { Application } from 'pixi.js'
import { initDevtools } from '@pixi/devtools'

let app: Application | null = null

export async function initPixiApp(
	canvas: HTMLCanvasElement,
	options: Parameters<Application['init']>[0] = {},
) {
	if (app) {
		app.destroy()
	}
	app = new Application()
	await app.init({
		width: 1600,
		height: 900,
		antialias: true,
		canvas,
		powerPreference: 'high-performance',
		...options,
	})
	await initDevtools({ app })
	return app
}
