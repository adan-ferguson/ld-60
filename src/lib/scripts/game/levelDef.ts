import type { ManProps } from '#lib/scripts/game/entities/man.ts'

export type Man = {
	kind: 'man'
} & Partial<ManProps>

type Turret = {
	kind: 'turret'
}

type PlayerSpawn = {
	kind: 'playerSpawn'
}

type Wall = {
	kind: 'wall'
}

type Lava = {
	kind: 'lava'
}

type TreasureSpawn = {
	kind: 'treasureSpawn'
}

export type MovingBlockDef = {
	kind: 'movingBlock'
	axis: 'x' | 'y'
	initialDir?: -1 | 1
	speed?: number
	range: [number, number]
}

export type TileContents = Man | Turret | PlayerSpawn | Wall | Lava | TreasureSpawn | MovingBlockDef

export type VariableContents = TileContents & {
	loop?: 1 | 2 | 3 | (1 | 2 | 3)[]
}

type TileDefs = Record<string, VariableContents | VariableContents[]>

export type LevelDef = {
	displayName: string
	tiles: string
	contents: TileDefs
}
