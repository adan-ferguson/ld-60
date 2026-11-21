import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelOrdeal: LevelDef = {
	displayName: 'Ordeal',
	phantaSpawnTime: 90,
	turretShotTime: [4, 1, 1.25],
	treasureSpawnTime: [5, 17, 28],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.....x....F.......F.........1.x
x.....x........................x
x..xx.x...................xx...x
x..ax.x....................x...x
x...x.x.s......C.......C...x...x
x...x.x.xaaaaaaaaaaaaaaaaaax...x
xaaxx.x...................xx...x
xxxxx.x....................x...x
x.....x.D.......D..........x...x
x.....x...................mx...x
x.....x................xxxxx...x
x.....x....................x...x
x.xaaax........t...............x
x..............a...............x
x.........a.........a..........x
xx.......................Axx.B.x
xllllllllllllllllllllllllllxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.....x..4...................1.x
x.....x..................5.....x
x..ax.x..4..........x.....xx...x
x..aa.x.xaaxaaxaaxaaaaaxaaax...x
x...a.x.xaaaaaaaaaaaaaaaaaax...x
x..sa.x....................x...x
xaaxa.x....................x...x
xaaaa.x....................x...x
x.....x.66................Mx...x
x.....x..........x..x..x..xx...x
x.....x........................x
x.....x........................x
x.xaaax........................x
x.....a.....a.....a.....a......x
x........a.....a.....at......3.x
xx.................2......xx...x
xllllllllllllllllllllllllllllllx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xaaaaax....a...a.aa...a.a...111x
x.....x....a...a...............x
x.....x....ayyya....x.....xx...x
x..a..x......a.........x..xx...x
xs.aa.xa.axxxxxxx.........xx.9.x
xxxxx.x..aaaaaaaaaaa.aaaaaax...x
x1111.x....................x...x
x1111.x...................mx...x
x1111.xxxxxxxxxxxxxxxxxxxxxx...x
x1111.x....................x...x
x1111.x.............t......x...x
x11111x........................x
x..............................x
x........a...aaaa...a..........x
x........a..........a..........x
xx.................8......x....x
xllllllllllllllllllllllllllllllx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		l: { kind: 'lava' },
		a: { kind: 'spikes' },
		1: { kind: 'turret' },
		2: { kind: 'movingBlock', isX: true, speed: 22, initialDir: -1 },
		3: { kind: 'movingBlock', isX: false, speed: 12, initialDir: -1 },
		4: { kind: 'movingBlock', isX: true, type: 'spike', speed: 30, range: [0, 16] },
		5: {
			kind: 'movingBlock',
			isX: true,
			type: 'spike',
			speed: 30,
			range: [-16, 0],
			initialDir: -1,
		},
		6: { kind: 'movingBlock', isX: false, range: [-3, 2] },
		7: { kind: 'movingBlock', isX: true, range: [0, 6], type: 'spike', speed: 24 },
		8: { kind: 'movingBlock', isX: true, speed: 50 },
		9: { kind: 'movingBlock', isX: false, speed: 5, initialDir: -1 },
		A: { kind: 'movingBlock', isX: true, speed: 32, initialDir: -1 },
		B: { kind: 'movingBlock', isX: false, speed: 14, initialDir: -1 },
		C: { kind: 'movingBlock', isX: false, range: [-4, 0], speed: 12 },
		D: { kind: 'movingBlock', isX: false, range: [0, 2] },
		E: { kind: 'movingBlock', isX: false, range: [-1, 0] },
		F: { kind: 'movingBlock', isX: false, range: [-0, 4], speed: 12 },
		m: { kind: 'shooterMan', facing: -1 },
		M: { kind: 'shooterMan', facing: -1, health: 10 },
		y: { kind: 'thinFloor' },
	},
}
