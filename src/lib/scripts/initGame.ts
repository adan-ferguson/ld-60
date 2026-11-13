import { initPixiApp } from '#lib/scripts/pixi/initPixiApp'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils'
import { GameController } from '#lib/scripts/gameController.ts'
import { MusicPlayer } from '#lib/scripts/audio/musicPlayer.ts'
import { SfxPlayer } from '#lib/scripts/audio/sfxPlayer.ts'

export async function initGame(canvas: HTMLCanvasElement, testWave?: number) {
	const [app] = await Promise.all([
		initPixiApp(canvas),
		AssetUtils.preload(),
		MusicPlayer.preload(),
		SfxPlayer.preload(),
	])
	return GameController.setup(app, testWave)
}
