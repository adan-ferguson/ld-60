import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level001: LevelDef = {
	displayName: 'Turret Tantrum',
	treasureSpawnTime: 5,
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x3.............3..............3x
x..............................x
x..............................x
x..............................x
xs............................tx
xx............................xx
x.............................2x
x....xx..................xx....x
x....xx.......x11x.......xx....x
x2............xxxx...b.........x
x........xxx..xxxx..xxx........x
x.....b..x1x........x1x........x
x....xx..................xx....x
x....xx..................xx....x
xxx..........................xxx
xx1b........................b1xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		u: { kind: 'treasureSpawn', loop: [2, 3] },
		x: { kind: 'wall' },
		y: { kind: 'wall', loop: [2, 3] },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', loop: [2, 3] },
		3: { kind: 'turret', loop: [3] },
		a: { kind: 'runnerMan' },
		b: { kind: 'runnerMan', loop: [2, 3] },
		c: { kind: 'runnerMan', loop: [3] },
	},
}
