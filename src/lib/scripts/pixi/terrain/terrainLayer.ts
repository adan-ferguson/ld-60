import { Assets, type ColorSource, Graphics, Sprite } from 'pixi.js'
import type { LevelInstance } from '#lib/scripts/game/levelInstance.ts'
import { Consts } from '#lib/scripts/consts.ts'
import { AssetUtils } from '#lib/scripts/pixi/assetUtils.ts'

AssetUtils.requestPreload({
	src: `/assets/sprites/spike.png`,
	alias: `spike`,
})

export class TerrainLayer extends Graphics {
	setLevel(level: LevelInstance) {
		const { TILE_SIZE_PX } = Consts
		this.clear()
		for (const tile of level.tiles.values) {
			const x = tile.tileXY.x * TILE_SIZE_PX
			const y = tile.tileXY.y * TILE_SIZE_PX
			const { kind } = tile.contents
			if (kind === 'wall') {
				this.rect(x, y, TILE_SIZE_PX, TILE_SIZE_PX).fill('#DDD')
			} else if (kind === 'lava') {
				this.rect(x, y, TILE_SIZE_PX, TILE_SIZE_PX).fill('red')
				randomSquare(this, x, y, TILE_SIZE_PX, 1, 'orange')
				randomSquare(this, x, y, TILE_SIZE_PX, 1, 'orange')
			} else if (kind === 'spikes') {
				this.addChild(
					new Sprite({
						texture: Assets.get('spike'),
						x,
						y,
					}),
				)
			}
		}
	}
}

function randomSquare(
	gfx: Graphics,
	xOffset: number,
	yOffset: number,
	tileSize: number,
	squareSize: number,
	color: ColorSource,
) {
	const x = Math.floor(Math.random() * (tileSize - squareSize)) + xOffset
	const y = Math.floor(Math.random() * (tileSize - squareSize)) + yOffset
	gfx.rect(x, y, squareSize, squareSize).fill(color)
}
