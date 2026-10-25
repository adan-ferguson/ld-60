import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelTight: LevelDef = {
	displayName: 'Cramped Spaces',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...xxxxxxxx........3xxxxxxxxxxx
x.s.....................1xxxxxxx
xxxx.xxxxxxxx...e....xxxxxxxxxxx
xxxx....xxxxx...xxxxxxxx2xxxxxxx
x1......xxxxx.................3x
xxxxxxx.xxxxx..................x
xxxx1xx.xx.........xx...v...xx.x
xxxx.xx.xx......dxxxx...x...xx.x
xxxx.xx.xx..xxxxxxxxxlllllllxx.x
xxxx.xx.xx..xxxxxxxxxxxxxxxxxx.x
xxxx.xx.xx.................xxx.x
xxxx.xx.xx...d........d...uxxx.x
xxxx.xx.xxxxxxxxxx.xxxxxxxxxxx.x
xxxx.xx.xxxxxxxxxx.xxxxxxxxxxx.x
xxxx...............xt..........x
xxxxxxxxxxx.................abcx
xxxxxxxxxxxxxlllxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		u: { kind: 'treasureSpawn', loop: 2 },
		v: { kind: 'treasureSpawn', loop: 3 },
		x: { kind: 'wall' },
		y: { kind: 'wall', loop: [2, 3] },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', loop: [2, 3] },
		3: { kind: 'turret', loop: [3] },
		a: { kind: 'man', behavior: 'stand', facing: -1, loop: 1 },
		b: { kind: 'man', behavior: 'stand', facing: -1, loop: 2 },
		c: { kind: 'man', behavior: 'stand', facing: -1, loop: 3 },
		d: { kind: 'man' },
		e: { kind: 'man', loop: [2, 3] },
	},
}
