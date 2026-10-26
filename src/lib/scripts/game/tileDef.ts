import { Consts } from '#lib/scripts/consts.ts'
import { XYMap } from '#lib/scripts/utils/XYMap.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import type { LevelDef, TileContents, VariableContents } from '#lib/scripts/game/levelDef.ts'
import { Rectangle } from 'pixi.js'

export type TileDef = {
	tileXY: XY
	contents: TileContents
}

function parseLevelTiles(level: LevelDef, loops: number) {
	const rows = level.tiles.split('\n').filter((line) => line.trim().length > 0)
	if (rows.length !== Consts.TILES_Y) {
		throw new Error(
			`Invalid number of rows in tiles. Expected ${Consts.TILES_Y}, got ${rows.length}`,
		)
	}
	const parsed: XYMap<TileDef> = new XYMap()
	const contentsMap = makeContentsMap(level.contents, loops)
	let spawnPosition: XY | undefined = undefined
	for (let y = 0; y < rows.length; y++) {
		const row = rows[y]!
		if (row.length !== Consts.TILES_X) {
			throw new Error(
				`Invalid number of columns in tiles. Expected ${Consts.TILES_X}, got ${row.length}`,
			)
		}
		for (let x = 0; x < row.length; x++) {
			const contents = contentsMap.get(row[x]!)
			const XY = { x, y }
			if (contents) {
				if (contents.kind === 'playerSpawn') {
					if (spawnPosition) {
						throw new Error(
							`Multiple spawn points found in tiles. Only one spawn point is allowed.`,
						)
					}
					spawnPosition = XY
				}
				parsed.set({ x, y }, { tileXY: XY, contents })
			} else if (x == 0 || x == Consts.TILES_X - 1 || y == 0 || y == Consts.TILES_Y - 1) {
				throw new Error(
					"Invalid tile at border. Borders must be walls. I know I should have done this programmatically but I didn't! It's a game jam geez leave me alone.",
				)
			}
		}
	}
	return { spawnPosition: spawnPosition!, tiles: parsed }
}

function makeContentsMap(contents: LevelDef['contents'], loops: number) {
	const map = new Map<string, TileContents>()
	for (const [id, content] of Object.entries(contents)) {
		let validContent: TileContents | undefined
		if (Array.isArray(content)) {
			validContent = content.find((c) => loopMatch(c.loop, loops))
		} else {
			validContent = loopMatch(content.loop, loops) ? content : undefined
		}
		if (validContent) {
			map.set(id, validContent)
		}
	}
	return map
}

function loopMatch(loops: VariableContents['loop'], currentLoop: number) {
	const l: 1 | 2 | 3 = Math.min(3, currentLoop) as 1 | 2 | 3
	if (loops === undefined) {
		return true
	}
	if (Array.isArray(loops)) {
		return loops.includes(l)
	}
	return loops === l
}

export const TileDef = {
	parseLevelTiles,
	toWorldXY(tileXY: XY): XY {
		return {
			x: TileDef.toWorld(tileXY.x),
			y: TileDef.toWorld(tileXY.y),
		}
	},
	toWorld(number: number) {
		return number * Consts.TILE_SIZE_PX + Consts.TILE_SIZE_PX / 2
	},
	toWorldRect(tileXY: XY) {
		return new Rectangle(
			TileDef.toWorld(tileXY.x),
			TileDef.toWorld(tileXY.y),
			Consts.TILE_SIZE_PX,
			Consts.TILE_SIZE_PX,
		)
	},
}
