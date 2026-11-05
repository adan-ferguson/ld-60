import type { TurretProps } from '#lib/scripts/game/entities/turret.ts'
import { type ShooterManProps } from '#lib/scripts/game/entities/shooterMan.ts'
import { type RunnerManProps } from '#lib/scripts/game/entities/runnerMan.ts'

export type ShooterDef = {
	kind: 'shooterMan'
} & Partial<ShooterManProps>

export type RunnerDef = {
	kind: 'runnerMan'
} & Partial<RunnerManProps>

type Turret = {
	kind: 'turret'
} & Partial<TurretProps>

type PlayerSpawn = {
	kind: 'playerSpawn'
}

type Wall = {
	kind: 'wall'
}

type AfterBossWall = {
	kind: 'afterBossWall'
}

type Lava = {
	kind: 'lava'
}

type Spikes = {
	kind: 'spikes'
}

type TreasureSpawn = {
	kind: 'treasureSpawn'
}

type PrincessTile = {
	kind: 'princess'
}

type BossManTile = {
	kind: 'bossMan'
}

export type MovingBlockDef = {
	kind: 'movingBlock'
	isX: boolean
	type?: 'block' | 'spike'
	initialDir?: -1 | 1
	speed?: number
	range?: [number, number]
}

export type TileContents =
	| ShooterDef
	| RunnerDef
	| Turret
	| PlayerSpawn
	| Wall
	| Lava
	| TreasureSpawn
	| MovingBlockDef
	| Spikes
	| PrincessTile
	| BossManTile
	| AfterBossWall

export type VariableContents = TileContents & {
	loop?: 1 | 2 | 3 | (1 | 2 | 3)[]
}

type TileDefs = Record<string, VariableContents | VariableContents[]>

export type LevelDef = {
	displayName: string
	tiles: string
	contents: TileDefs
	phantaSpawnTime?: [number, number, number]
	turretShotTime?: [number, number, number]
}
