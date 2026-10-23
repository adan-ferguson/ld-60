import { Assets, type UnresolvedAsset } from 'pixi.js'

const toPreload: UnresolvedAsset[] = []

// Might use this more if loading becomes an issue
export const AssetUtils = {
	async preload() {
		await Assets.load(toPreload)
	},
	requestPreload(asset: UnresolvedAsset) {
		toPreload.push(asset)
	},
}
