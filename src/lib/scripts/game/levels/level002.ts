import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level002: LevelDef = {
	displayName: 'Runners',
	treasureSpawnTime: 5,
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x2............................2x
x....a....................s....x
x...xxx..xxxxx....xxxxx..xxx...x
x........x............x........x
x........x............x........x
x........x......a.....x........x
x.......xx....xxxx....xx.......x
x.......x..............x.......x
xx......x..............x......xx
x.......x.a...........ax.......x
x......xxxxxx......xxxxxx......x
xt.............................x
xx.............a..............xx
x.............xxxx.............x
x..............................x
x2.a....................c.....2x
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
