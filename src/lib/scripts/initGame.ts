import { initPixiApp } from '#lib/scripts/pixi/initPixiApp'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils'
import { GameController } from '#lib/scripts/gameController.ts'

export async function initGame(canvas: HTMLCanvasElement) {
	const [app, _] = await Promise.all([initPixiApp(canvas), AssetUtils.preload()])
	return GameController.setup(app)
}
