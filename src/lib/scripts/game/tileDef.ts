import { Consts } from '#lib/scripts/consts.ts'

export type TileDef = {
	x: number
	y: number
	type: TileType
}

export type TileType = 'blank'

function parseLevel(tiles: string) {
	const rows = tiles.split('\n').filter((line) => line.trim().length > 0)
	if (rows.length !== Consts.TILES_Y) {
		throw new Error(
			`Invalid number of rows in tiles. Expected ${Consts.TILES_Y}, got ${rows.length}`,
		)
	}
	const parsed: TileDef[] = []
	for (let y = 0; y < rows.length; y++) {
		const row = rows[y]!
		if (row.length !== Consts.TILES_X) {
			throw new Error(
				`Invalid number of columns in tiles. Expected ${Consts.TILES_X}, got ${row.length}`,
			)
		}
		for (let x = 0; x < row.length; x++) {
			const tile = row[x]!
			parsed.push({ x, y, type: getTileType(tile) })
		}
	}
	return parsed
}

function getTileType(char: string): TileType {
	if (char == '.') {
		return 'blank'
	}
	throw new Error(`Invalid character in tiles: ${char}`)
}

export const TileDef = {
	parseLevel,
}
