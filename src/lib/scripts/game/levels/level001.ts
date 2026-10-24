import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level001: LevelDef = {
	displayName: 'Level 1',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x3.............3..............3x
x..............................x
xt.............................x
x..............................x
x.............................tx
x.............................xx
x.............................2x
xs.......................xx....x
xx...........xx1xx.......xx....x
x2...........xxxxx...b.........x
x........xx..xx1xx..xxx........x
x.....b..xx.........xxx........x
x....xx..................xx....x
x....xx..................xx....x
xxx..........................xxx
xx1b...........t............b1xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		u: { kind: 'treasureSpawn', minLoop: 2 },
		x: { kind: 'wall' },
		y: { kind: 'wall', minLoop: 2 },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', minLoop: 2 },
		3: { kind: 'turret', minLoop: 3 },
		a: { kind: 'man' },
		b: { kind: 'man', minLoop: 2 },
		c: { kind: 'man', minLoop: 3 },
	},
}
