import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelMovers: LevelDef = {
	displayName: 'Shifty Shenanigans',
	phantaSpawnTime: [90, 90, 90],
	turretShotTime: [4, 3.5, 3],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1x........1x..................x
x.x.........x..................x
x.x.........x......x...d...x...x
x.x.........x......xxxxxxxxx...x
x...........x.......x..a...x...x
xxx....u....x..s...........x...x
x..................xxxxxxx.x...x
x...............h..xxxxxxx.x...x
x..............v...xxxxxxx1x...x
x..........ii......xxxxxxxxx...x
x.................xxx..1xxxx...x
xxxxxxxxxxxxx.....xxx.xxxxx....x
x1xt..............xxxyxxxxx....x
x.................xxx..axxxxvvvx
x.....................xxxxxx...x
x....u.....x......2...xxxxx1...x
xllllllllllxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1xt.......1x..........e.......x
x.x.........x..................x
x.x.........x......x...d...x...x
x.x.........x......xxxxxxxxxbb.x
x...........x..............x...x
xxx...u.....x..s...........x...x
x..................x.....a.x...x
x...............h..x.....a.x...x
x..............v...xxxxxxx1x.bbx
x.......g..........xxxxxxxxx...x
xbbbbbbbbbbbb.....xxx...xxxx...x
xxxxxxxxxxxxx.....xxx...xxx....x
x1x...............xxxyxyxxx....x
x.................xxx..axxxxbb.x
x.....................x.xxxx...x
x....j.....x......2...x..1x1vvvx
xllllllllllxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1.....................e.......x
xxxx...........................x
xxxx...............x...d...x...x
xxxx...............xxxxxxxxxbb.x
xxxx...................m...x...x
x...n.........s........m...x...x
xxx................x...a...x...x
x1.................x...a...x...x
xxx................xxxxxxx1x.bbx
x.......g..........xxxxxxxxx...x
xbbbbbbbbbbbb......xx...xxxx...x
xxxbbbxxxxxxx.....xxx...xxx....x
x1x.t.............xxxyxyxxx....x
x.................xxx..dxxxxbb.x
x......b..............x.xxxx...x
x.k....bk.........2...x..1x1...x
xllllllllllllxxxxxxxxxxxxxxxxxxx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		1: { kind: 'turret' },
		2: { kind: 'runnerMan' },
		3: { kind: 'runnerMan', facing: -1 },
		4: { kind: 'movingBlock', isX: true, speed: 25 },
		u: { kind: 'movingBlock', isX: true },
		v: { kind: 'movingBlock', isX: false, speed: 16 },
		l: { kind: 'lava' },
		o: { kind: 'movingBlock', isX: true, speed: 30 },
		a: { kind: 'movingBlock', isX: true, type: 'spike' },
		b: { kind: 'spikes' },
		d: { kind: 'movingBlock', isX: true, type: 'spike', speed: 40 },
		e: { kind: 'movingBlock', isX: true, type: 'spike', speed: 40, range: [-3, 3], initialDir: -1 },
		f: { kind: 'movingBlock', isX: true, range: [-5, 0] },
		g: { kind: 'movingBlock', isX: true, range: [-7, 4] },
		h: { kind: 'movingBlock', isX: false, initialDir: -1 },
		i: { kind: 'thinFloor' },
		j: { kind: 'movingBlock', isX: true, range: [-3, 5] },
		k: { kind: 'movingBlock', isX: true, range: [0, 4] },
		m: { kind: 'movingBlock', isX: true, range: [-3, 3], initialDir: -1, type: 'spike' },
		n: { kind: 'movingBlock', isX: true, range: [-3, 8] },
	},
}
