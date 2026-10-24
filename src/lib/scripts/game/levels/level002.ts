import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level002: LevelDef = {
	displayName: 'Level 2',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x2............................2x
x....a....................s....x
x...xxx..................xxx...x
x........xxxxxx..xxxxxx........x
x........x............x........x
x........x.....a......x........x
x.......xx...xxxxxx...xx.......x
xt......3x....... ....x3......tx
xx.......x............x.......xx
x........x.a........a.x........x
x.......xxxxx......xxxxx.......x
x..............................x
xx.............a..............xx
x.............xxxx.............x
x..............................x
x2.a....................c.....2x
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
