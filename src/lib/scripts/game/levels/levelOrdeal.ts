import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelOrdeal: LevelDef = {
	displayName: 'Ordeal',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.....x....F.......F.........1.x
x.....x........................x
x..xx.x....................x...x
x..ax.x....................x...x
x...x.x........C.......C...x...x
x..sx.x.xaaaaaaaaaaaaaaaaaax...x
xllxx.x...................xx...x
xxxxx.x....................x...x
x.....x.D..................x...x
x.....x...................mx...x
x.....x............xxxxxxxxx...x
x.xlllx....................x...x
x.xxxxx........................x
x.....a.......a.......a........x
x.........a.......a............x
xx...................A....xx.B.x
xllllllllllllllllllllllllllllllx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		l: { kind: 'lava' },
		a: { kind: 'spikes' },
		b: { kind: 'spikes', loop: 3 },
		1: { kind: 'turret' },
		A: { kind: 'movingBlock', isX: true, speed: 28, initialDir: -1 },
		B: { kind: 'movingBlock', isX: false, speed: 14, initialDir: -1 },
		C: { kind: 'movingBlock', isX: false, range: [-4, 0], speed: 12 },
		D: { kind: 'movingBlock', isX: false, range: [0, 2] },
		E: { kind: 'movingBlock', isX: false, range: [-1, 0] },
		F: { kind: 'movingBlock', isX: false, range: [-0, 4], speed: 12 },
		m: { kind: 'shooterMan', facing: -1 },
	},
}
