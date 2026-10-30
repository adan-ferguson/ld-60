import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelMovers: LevelDef = {
	displayName: 'Moving Blocks 2',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1x1.v.........................x
x.x...v........s...............x
x.x....v............xd......c..x
x.x.................xxxxxxxxxx1x
x.xxxxxxxxxx...v...............x
x.x...........................xx
x..............................x
xxx........w...........x.c.....x
xxx........w..........xxx2.....x
xxx........w.........xxxxx.....x
xxx........w........xx...xx....x
xxxxxxxxxxxx.......xxx...xxx...x
x1xt..............xxxx.x.xxxx..x
x................xxxxx.a.xxxxx.x
x......................x.xxxxx.x
x....2.....x..........ex....1x1x
xllllllllllxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		x: { kind: 'wall' },
		1: { kind: 'turret' },
		2: { kind: 'movingBlock', isX: true },
		v: { kind: 'movingBlock', isX: false },
		w: { kind: 'movingBlock', isX: true, range: [-8, 0] },
		l: { kind: 'lava' },
		o: { kind: 'movingBlock', isX: true, speed: 30 },
		a: { kind: 'movingBlock', isX: true, type: 'spike' },
		b: { kind: 'movingBlock', isX: false, type: 'spike' },
		c: { kind: 'man', behavior: 'stand', facing: -1 },
		d: { kind: 'movingBlock', isX: true, type: 'spike', speed: 50 },
		e: { kind: 'man', facing: -1 },
	},
}
