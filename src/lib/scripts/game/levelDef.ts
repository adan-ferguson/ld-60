import type { ManProps } from '#lib/scripts/game/enemies/man.ts'

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

type MovingBlock = {
	kind: 'movingBlock'
	left: number
	right: number
	up: number
	down: number
}

export type TileContents = Man | Turret | PlayerSpawn | Wall | Lava | TreasureSpawn | MovingBlock

export type VariableContents = TileContents & {
	loop?: 1 | 2 | 3 | (1 | 2 | 3)[]
}

type TileDefs = Record<string, VariableContents | VariableContents[]>

export type LevelDef = {
	displayName: string
	tiles: string
	contents: TileDefs
}
