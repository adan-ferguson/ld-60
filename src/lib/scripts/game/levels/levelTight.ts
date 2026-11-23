import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelTight: LevelDef = {
	displayName: 'Cramped Chimney',
	treasureSpawnTime: [10, 12, 16],
	phantaSpawnTime: [90, 60, 60],
	turretShotTime: [4, 3, 2],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..x....xxxx.....xxxxxxxxxxxxxxx
xs.x.............xxxxxxxxxxxxxxx
xx.x....xxxxx....xxxxxxxxxxxxxxx
xxyxyxx.xxxxx...xxxxxxxxxxxxxxxx
xx...xx.xxxxxx.................x
xxxxxxx.x......................x
xxxxxxx.x..........xx.......xx.x
xxxxxxx.x.........cxx...x...xx.x
xxxxxxx.x.xxxxxxxxxxx.......xx.x
xxxxxxx.xyxxxxxxxxxxx.......xx.x
xxxx1xx.x.xx................xx.x
xxxxyxx.x.xx.b..............xx.x
xxxx.xx.x....xxxxyyxxxxxxxxxxx.x
xxx.....xxxxxxxxx..xxxxxxxxxxx.x
x1.................xt..........x
xxxxxxxxxxx.................a..x
xxxxxxxxxxxxxllxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..x....xxxx..................2x
xs.x..........................2x
xx.x....xxxxx.................2x
xxyxyxx.xxxxx...xxxxxxxxxxxxxxxx
xx...xx.xxxxxx.................x
xxxxxxx.x......................x
xxxx1xx.x..........xx...f...xx.x
xxxxyxx.x.........dxx...x...xx.x
xxxx.xx.x.xxxxxxxxxxxlllllllxx.x
xxxx.xx.xyxxxxxxxxxxxxxxxxxxxx.x
xxxx1xx.x.xx...........xxxxxxx.x
xxxxyxx.x.xx.b........axxxxxxx.x
xxxx.xx.x....xxxxyyxxxxxxxxxxx.x
xxx.....xxxxxxxxx..xxxxxxxxxxx.x
x1.................x...........x
xxxxxxxxxxx.................a.tx
xxxxxxxxxxxxxlllxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..x....xxxx.................22x
xs.x.........................22x
xx.x....xxxxx................22x
xxyxyxx.xxxxx...xxxxxxxxxxxxxxxx
xx...xx.xxxxxx.................x
xx...xx.x......................x
xxyxxxx.x..........xxf.....fxx.x
xx.xxxx.x.........dxx...x...xx.x
x..xtxx.x.xxxxxxxxxxxlllllllxx.x
x..x.xx.xyxxxxxxxxxxxxxxxxxxxx.x
xyxx.xx.x.xx...........xxxxxxx.x
x.xx.xx.x.xx.bbb....aaaxxxxxxx.x
x1111x1.x....xxxxyyxxxxxxxxxxx.x
x11x111.xxxxxxxxx..xxxxxxxxxxx.x
x111111............x...........x
xxxxxxxxxxx...................ex
xxxxxxxxxxxllxlllxxxxxxxxxxxxxxx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		z: { kind: 'thinFloor', position: 'bottom' },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', health: 3 },
		a: { kind: 'shooterMan', facing: -1 },
		b: { kind: 'shooterMan', facing: 1 },
		c: { kind: 'runnerMan' },
		d: { kind: 'runnerMan', health: 3 },
		e: { kind: 'shooterMan', health: 3, facing: -1 },
		f: { kind: 'movingBlock', type: 'spike', isX: true },
		g: { kind: 'spikes' },
		v: { kind: 'movingBlock', isX: false, range: [0, 2] },
	},
}
