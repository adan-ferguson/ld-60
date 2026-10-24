import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level001: LevelDef = {
	displayName: 'Level 1',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.............................3x
x..............3...............x
x..............................x
x..............................x
x.............................tx
x..............2..............xx
x.........................c...2x
xs.......................xx....x
xx...........xx1xx.......xx....x
x............xxxxx...b.........x
x.....xxxxx..xx1xx..xxx........x
x........xx.........xxx........x
x....xx..................xx....x
xt...xx..................xx...tx
xxx...x......................xxx
xx1b........................c1xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		l: { kind: 'lava' },
		1: { kind: 'enemy', enemyKind: 'turret' },
		2: { kind: 'enemy', enemyKind: 'turret', minLoop: 2 },
		3: { kind: 'enemy', enemyKind: 'turret', minLoop: 3 },
		a: { kind: 'enemy', enemyKind: 'man' },
		b: { kind: 'enemy', enemyKind: 'man', minLoop: 2 },
		c: { kind: 'enemy', enemyKind: 'man', minLoop: 3 },
	},
}
