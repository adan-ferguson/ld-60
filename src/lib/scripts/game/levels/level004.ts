import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level004: LevelDef = {
	displayName: 'Lava Lake',
	treasureSpawnTime: [10, 22, 16],
	phantaSpawnTime: 35,
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x...........................s..x
x.........................xxxxxx
x..........................x.1.x
x....t........a............x...x
x.............xx...............x
x........xx...xx....xx.........x
xlllll...xx.........xx.....x...x
xxxxxx...xx................x...x
x.1.xx...xx....................x
x...xx........xx...............x
x.............xx....xx.....x...x
x...................xx.....x...x
x........xx.........1x...x.x...x
x...xx...x1.........xx.....x...x
x...xx...xx...xx....xx.....x...x
xllllllllllllllllllllllllllllllx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x...........................s..x
x.........................xxxxxx
x..........................x111x
x1.............a...........x...x
x.............xx...............x
x........xx...xx....xx.........x
xlllll...xx.........xx.....x...x
xxxxxx...xx................x...x
x111xx...xx...b................x
x...xx........xx...............x
x.............xx....xx.....x...x
x...................xx.....x...x
x........xx.........1x.....x...x
x...xx...x1.........xx.....x...x
x...xx...xx...xx....xx.....x.t.x
xllllllllllllllllllllllllllllllx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xt.............................x
x...........................s..x
x.........................xxxxxx
x..........................x111x
x1.............a...........x...x
x.............xx...............x
x........xx...xx....xx.........x
xlllll...xx.........xx.....x...x
xxxxxx...xx................x...x
x111xx...xx...b................x
x...xx........xx...............x
x.............xx....xx.....x...x
x...................xx.....x...x
x........xx.........1x.....x...x
x........x1...b.....x1.....x...x
xd.......xx...xx....xxd....x...x
xllllllllllllllllllllllllllllllx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		a: { kind: 'shooterMan' },
		b: { kind: 'runnerMan', health: 3 },
		c: { kind: 'shooterMan', facing: -1 },
		d: { kind: 'movingBlock', isX: true },
	},
}
