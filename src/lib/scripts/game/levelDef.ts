type Man = {
	kind: 'man'
	facing?: 1 | -1
	behavior?: 'patrol'
}

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

export type TileContents = Man | Turret | PlayerSpawn | Wall | Lava | TreasureSpawn

export type VariableContents = TileContents & {
	minLoop?: 2 | 3
	maxLoop?: 1 | 2
	loop?: 1 | 2 | 3
}

type TileDefs = Record<string, VariableContents>

export type LevelDef = {
	displayName: string
	tiles: string
	contents: TileDefs
}
