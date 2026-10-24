import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level002: LevelDef = {
	displayName: 'Level 2',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x2............................2x
x....t....................s....x
x...xxx....a.............xxx...x
x....1...xxxxxx..xxxxxx...1....x
x........x............x........x
x........x.....a......x........x
x.......xx...xxxxxx...xx.......x
x.......3x.....11.....x3.......x
xx.......x............x.......xx
x........x.c........b.x........x
x.......xxxxx......xxxxx.......x
xt............................tx
xx.............a..............xx
x.............xxxx.............x
x..............................x
x1......b......t........c.....1x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', minLoop: 2 },
		3: { kind: 'turret', minLoop: 3 },
		a: { kind: 'enemy', enemyKind: 'man' },
		b: { kind: 'enemy', enemyKind: 'man', minLoop: 2 },
		c: { kind: 'enemy', enemyKind: 'man', minLoop: 3 },
	},
}
