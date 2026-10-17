import { Consts } from '#lib/scripts/consts.ts'
import { XYMap } from '#lib/scripts/utils/XYMap.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

export type TileDef = {
	XY: XY
	type: TileType
}

export type TileType = 'wall' | 'spawn'

function parseLevel(levelTiles: string) {
	const rows = levelTiles.split('\n').filter((line) => line.trim().length > 0)
	if (rows.length !== Consts.TILES_Y) {
		throw new Error(
			`Invalid number of rows in tiles. Expected ${Consts.TILES_Y - 2}, got ${rows.length}`,
		)
	}
	const parsed: XYMap<TileDef> = new XYMap()
	let spawnPosition: XY | undefined = undefined
	for (let y = 0; y < rows.length; y++) {
		const row = rows[y]!
		if (row.length !== Consts.TILES_X) {
			throw new Error(
				`Invalid number of columns in tiles. Expected ${Consts.TILES_X - 2}, got ${row.length}`,
			)
		}
		for (let x = 0; x < row.length; x++) {
			const tile = row[x]!
			const type = getTileType(tile)
			const XY = { x, y }
			if (type) {
				if (type === 'spawn') {
					if (spawnPosition) {
						throw new Error(
							`Multiple spawn points found in tiles. Only one spawn point is allowed.`,
						)
					}
					spawnPosition = XY
				}
				parsed.set({ x, y }, { XY, type })
			} else if (x == 0 || x == Consts.TILES_X - 1 || y == 0 || y == Consts.TILES_Y - 1) {
				throw new Error(
					"Invalid tile at border. Borders must be walls. I know I should have done this programmatically but I didn't! It's a game jam geez leave me alone.",
				)
			}
		}
	}
	return { spawnPosition: spawnPosition!, tiles: parsed }
}

function getTileType(char: string): TileType | null {
	if (char == '.') {
		return null
	}
	if (char == 'x') {
		return 'wall'
	}
	if (char == 'S') {
		return 'spawn'
	}
	throw new Error(`Invalid character in tiles: ${char}`)
}

export const TileDef = {
	parseLevel,
}
