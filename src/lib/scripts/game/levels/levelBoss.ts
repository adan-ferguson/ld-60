import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelBoss: LevelDef = {
	displayName: 'Boss',
	phantaSpawnTime: 0,
	treasureSpawnTime: [6, 12, 16],
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x......t................p......x
x.xxxxxxxxxxx......xxxxxxxxxxx.x
x..............................x
x..............................x
x..............................x
x...............y..............x
x..............................x
x..............................x
x..............................x
x.............y................x
x..............................x
x..............................x
x......s................1......x
x.....xxxxxxxxxxxxxxxxxxxx.....x
x..............................x
xllllllllllllllllllllllllllllllx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		p: { kind: 'princess' },
		x: { kind: 'wall' },
		y: { kind: 'conditionalBlock', condition: 'afterBoss' },
		l: { kind: 'lava' },
		1: { kind: 'bossMan' },
	},
}
