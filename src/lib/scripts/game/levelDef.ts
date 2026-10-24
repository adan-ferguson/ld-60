import type { EnemyKind } from '#lib/scripts/game/enemies/enemy.ts'

type Enemy = {
	kind: 'enemy'
	enemyKind: EnemyKind
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

export type TileContents = Enemy | PlayerSpawn | Wall | Lava | TreasureSpawn

export type VariableContents = TileContents & {
	minLoop?: 2 | 3
	maxLoop?: 1 | 2
}

type TileDefs = Record<string, VariableContents>

export type LevelDef = {
	displayName: string
	tiles: string
	contents: TileDefs
}
