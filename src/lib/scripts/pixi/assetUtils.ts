import { Assets, type UnresolvedAsset } from 'pixi.js'

const toPreload: UnresolvedAsset[] = [
	{
		alias: 'man-idle',
		src: '/src/lib/assets/sprites/man-idle.png',
	},
	{
		alias: 'man-fall',
		src: '/src/lib/assets/sprites/man-fall.png',
	},
	{
		alias: 'man-run',
		src: '/src/lib/assets/sprites/man-run.json',
	},
	{
		alias: 'man-jump',
		src: '/src/lib/assets/sprites/man-jump.png',
	},
	{
		alias: 'man-run',
		src: '/src/lib/assets/sprites/man-run.json',
	},
]

// Might use this more if loading becomes an issue
export const AssetUtils = {
	async preload() {
		await Assets.load(toPreload)
	},
	requestPreload(src: string, alias: undefined | string = undefined) {
		toPreload.push({ src, alias })
	},
}
