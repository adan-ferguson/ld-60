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

export type ConditionalBlockDef = {
	kind: 'conditionalBlock'
	condition: 'afterBoss'
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

export type ThinFloorDef = {
	kind: 'thinFloor'
	position?: 'top' | 'bottom'
}

export type MovingBlockDef = {
	kind: 'movingBlock'
	isX: boolean
	type?: 'block' | 'spike'
	initialDir?: -1 | 1
	speed?: number
	range?: [number, number]
	inactiveUntilJumpedOn?: boolean
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
	| ConditionalBlockDef
	| ThinFloorDef

type TileDefs = Record<string, TileContents>

export type LevelDef = {
	displayName: string
	contents: TileDefs
	hasPrincess?: boolean
	tiles: [string, string, string] | string
	treasureSpawnTime?: [number, number, number] | number
	phantaSpawnTime?: [number, number, number] | number
	turretShotTime?: [number, number, number] | number
}
