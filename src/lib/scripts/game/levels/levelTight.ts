import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelTight: LevelDef = {
	displayName: 'Cramped Spaces',
	treasureSpawnTime: [10, 5, 5],
	phantaSpawnTime: [60, 50, 40],
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..x...xxxxx......zzzzzzzzzzzz2x
xs.x..............zzzzzzzzzzzzxx
xx.xyxx.xxxxx.....xzzzxzzzxzzzxx
xxyx.xx.xxxxx...xxxxxxxxxxxxxxxx
xx...xx.xxxxx.................3x
xxxxxxx.xxxxx..................x
xxxxxxx.x..........xx.......xx.x
xxxxxxx.x.....a.zxxxx...x...xx.x
xxxxxxx.x..xxxxxxxxxxlllllllxx.x
x1...xx.x..xxxxxxxxxxxxxxxxxxx.x
xxxx.xx.x......x...xxxxxxxxxxx.x
xxxx.xx.x....d.x.d.xxxxxxxxxxx.x
xxxxyxx.xxxxxx...xyxxxxxxxxxxx.x
xxx...x.xxxxxxxxxx.xxxxxxxxxxx.x
x1.................xt..........x
xxxxxxxxxxx.................abcx
xxxxxxxxxxxxxlllxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		u: { kind: 'treasureSpawn', loop: 2 },
		v: { kind: 'treasureSpawn', loop: 3 },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		z: { kind: 'wall', loop: 1 },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: [{ kind: 'turret', loop: [2, 3] }, { kind: 'wall' }],
		3: { kind: 'turret', loop: [3] },
		a: { kind: 'shooterMan', facing: -1 },
		b: { kind: 'shooterMan', facing: -1, loop: 2 },
		c: { kind: 'shooterMan', facing: -1, loop: 3 },
		d: { kind: 'runnerMan' },
		e: { kind: 'runnerMan', loop: [2, 3] },
	},
}
