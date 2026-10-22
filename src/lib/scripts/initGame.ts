import { initPixiApp } from '#lib/scripts/pixi/initPixiApp'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils'
import { GameController } from '#lib/scripts/gameController.ts'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'

export async function initGame(canvas: HTMLCanvasElement, testWave?: number) {
	const [app, _, _1] = await Promise.all([
		initPixiApp(canvas),
		AssetUtils.preload(),
		LevelsManager.preloadAll(),
	])
	return GameController.setup(app, testWave)
}
