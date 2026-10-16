import { initPixiApp } from '#lib/scripts/pixi/initPixiApp'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils'

export async function initGame(canvas: HTMLCanvasElement) {
	const [app, _] = await Promise.all([initPixiApp(canvas), AssetUtils.preload()])
	return { app }
}
