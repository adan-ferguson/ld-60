import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level003: LevelDef = {
	displayName: 'Platform Picnic',
	treasureSpawnTime: [5, 15, 22],
	phantaSpawnTime: [30, 30, 32],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xt.....................xxxxxxxxx
x.............a........x1...xxxx
x............xxx...xxx.xx...xxxx
x.1.....1............x.xx.....xx
x....................x.x......xx
x....1.....x.........x.x......xx
x....................x.x......xx
x.......x.....1.....1x.xx.....xx
x....................x........xx
x..........x.....1...x........xx
x....................x........xx
x.......x.....x.....xx.xx.....xx
x.......x............x.xx.....xx
x...x...x........x...x.xx.....xx
x.......x..............xx.....xx
xs......x..............xxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x......................xxxxxxxxx
x.............a.....a..x1...bbxx
x............xxx...xxx.xxb..bbxx
x.1.....1.....1.bbb.1x.xx.....xx
x....................x.x......xx
x....1.....x.....1...x.x......xx
x....................x.x......xx
x.......x.....1.....1x.xx.....xx
x....................x........xx
x..........x.....1...x........xx
x....................x........xx
x.......x.....x.....1x.xx.....xx
x.......x............xtxx.....xx
x...x...x........x...x.xx.....xx
x.......x..............xx.....xx
xs......x..............xx.....xx
xxllllllxllllllllllllllxxlllllxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x......................xxxxxxxxx
x.............a.....c..x1....1xx
x............xxxbbbxxx.xxb..bxxx
x.1.....1.....1.....1x.xx.....xx
x....................x.x......xx
x....1.....1.....1...x.x......xx
x....................x.x......xx
x.......1.....1.....1x.xx.....xx
x....................x........xx
x..........1.....1...x........xx
x....................x........xx
x.......x.....1.....1x.xx.....xx
x.......x............x.xx.....xx
x...1...x........1...x.xx.....xx
x.......x..............xx.....xx
xs......x..............xx..t..xx
xxllllllxllllllllllllllxxlllllxx
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
	},
}
