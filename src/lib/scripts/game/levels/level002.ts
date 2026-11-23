import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level002: LevelDef = {
	displayName: 'Runners',
	treasureSpawnTime: [5, 5, 5],
	phantaSpawnTime: [30, 30, 30],
	turretShotTime: [3, 3, 3],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
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
x..a...........................x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x....a.....a........a.....s....x
x...xxx..xxxxx....xxxxx..xxx...x
x........x............x........x
x........x............x........x
x........x......a.....x........x
x.......xx....xxxx....xx.......x
x.......x..............x.......x
x1......x..............x......1x
x.......x.a...........ax.......x
x......1xxxxx......xxxxx1......x
xt.............................x
x1............................1x
x..............................x
x..............................x
x..a........................a..x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x....a.....c..............s....x
x...xxx..xxxxx....xxxxx..xxx...x
x........x............x........x
x........x............x........x
x.......bx......a.....x........x
x.......xx....xxxx....xx.......x
x.......x..............x.......x
x1......x..............x......1x
x.......x.a.x......x..ax.......x
x......1xxxxx......xxxxx1......x
xt.............................x
x1............................1x
x..............................x
x..............................x
x................a.............x
xlllllllllxxxxxxxxxxxxxxxxxxxxxx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		a: { kind: 'runnerMan' },
		b: { kind: 'spikes' },
		c: { kind: 'shooterMan' },
		d: { kind: 'shooterMan', facing: -1 },
		e: { kind: 'runnerMan', health: 3 },
	},
}
