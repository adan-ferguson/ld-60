import { Assets, type UnresolvedAsset } from 'pixi.js'

const toPreload: UnresolvedAsset[] = [
	{
		alias: 'man-spritesheet',
		src: '/assets/sprites/man.json',
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
