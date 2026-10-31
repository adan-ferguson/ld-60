import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelTight: LevelDef = {
	displayName: 'Cramped Spaces',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...xxxxxxxx..................1x
x.s...........................xx
xxxx.xxxxxxxx.....y...y...y...xx
xxxx....xxxxx...xxxxxxxxxxxxxxxx
x1......xxxxx.................3x
xxxxxxx.xxxxx..................x
xxxxxxx.x..........xx.......xx.x
xxxxxxx.x.......axxxx...x...xx.x
xxxxxxx.x.xxxxxxxxxxxlllllllxx.x
x1...xx.x.xxxxxxxxxxxxxxxxxxxx.x
xxxx.xx.x..........xxxxxxxxxxx.x
xxxx.xx.x....d.....xxxxxxxxxxx.x
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
		y: { kind: 'wall' },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', loop: [2, 3] },
		3: { kind: 'turret', loop: [3] },
		a: { kind: 'shooterMan', facing: -1 },
		b: { kind: 'shooterMan', facing: -1, loop: 2 },
		c: { kind: 'shooterMan', facing: -1, loop: 3 },
		d: { kind: 'runnerMan' },
		e: { kind: 'runnerMan', loop: [2, 3] },
	},
}
