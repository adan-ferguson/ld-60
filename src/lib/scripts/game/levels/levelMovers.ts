import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelMovers: LevelDef = {
	displayName: 'Moving Blocks 2',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1x3...........................x
x.xx...........s...............x
x.x1................xd......c..x
x.xx................xxxxxxxxxx1x
x.x............v.............xxx
x..............................x
xxg.....................c......x
x......g...............xu......x
x.....................xxx......x
x....................xxxxx.....x
xmmmmmmmmmmmm.......xx...xx....x
xxxxxxxxxxxxx......xxx...xxx...x
x1xt..............xxxx.x.xxxx..x
x................xxxxx.a.xxxxxbx
x......................x.xxxxx.x
x....u.....x.........e.x....1x1x
xllllllllllxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		x: { kind: 'wall' },
		1: { kind: 'turret' },
		3: { kind: 'turret', loop: 3 },
		u: { kind: 'movingBlock', isX: true },
		v: { kind: 'movingBlock', isX: false },
		w: { kind: 'movingBlock', isX: true, range: [-8, 0] },
		l: { kind: 'lava' },
		m: { kind: 'lava', loop: [2, 3] },
		o: { kind: 'movingBlock', isX: true, speed: 30 },
		a: { kind: 'movingBlock', isX: true, type: 'spike' },
		b: { kind: 'spikes' },
		c: { kind: 'shooterMan', facing: -1, health: 5 },
		d: { kind: 'movingBlock', isX: true, type: 'spike', speed: 50 },
		e: { kind: 'runnerMan', facing: -1 },
		f: { kind: 'movingBlock', isX: true, range: [-5, 0] },
		g: { kind: 'movingBlock', isX: true, range: [0, 5] },
	},
}
