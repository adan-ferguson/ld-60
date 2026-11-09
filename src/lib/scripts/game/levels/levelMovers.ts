import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelMovers: LevelDef = {
	displayName: 'Shifty Shenanigans',
	phantaSpawnTime: 60,
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...........x..................x
xc..........x..................x
xx..........x......x.c.d...x...x
x...........x......xxxxxxxxx...x
xc..........x..............x...x
xx.....g....x..s...........x...x
x..................x...a...x...x
x...............h..x...a...x...x
x..............v...xxxxxxx1x...x
x..........ii......xxxxxxxxx...x
xmmmmmmmmmmmm.....xxx..1xxxx...x
xxxxxxxxxxxxx.....xxx.xxxxx....x
x1xt..............xxxyxxxxx....x
x.................xxx..axxxxvvvx
x.....................xxxxxx...x
x....u.....x....e.....xxxxx1...x
xllllllllllxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		1: { kind: 'turret' },
		3: [
			{
				kind: 'wall',
				loop: [1, 2],
			},
			{
				kind: 'turret',
				loop: 3,
			},
		],
		u: { kind: 'movingBlock', isX: true },
		v: { kind: 'movingBlock', isX: false },
		l: { kind: 'lava' },
		m: { kind: 'lava', loop: [2, 3] },
		o: { kind: 'movingBlock', isX: true, speed: 30 },
		a: { kind: 'movingBlock', isX: true, type: 'spike' },
		b: { kind: 'spikes' },
		c: { kind: 'shooterMan', facing: 1, health: 1 },
		d: { kind: 'movingBlock', isX: true, type: 'spike', speed: 50 },
		e: { kind: 'runnerMan', facing: -1 },
		f: { kind: 'movingBlock', isX: true, range: [-5, 0] },
		g: { kind: 'movingBlock', isX: true, range: [-4, 4] },
		h: { kind: 'movingBlock', isX: false, initialDir: -1 },
		i: { kind: 'thinFloor' },
	},
}
