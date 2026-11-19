import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelTight: LevelDef = {
	displayName: 'Cramped Chimney',
	treasureSpawnTime: [10, 12, 25],
	phantaSpawnTime: [90, 60, 40],
	turretShotTime: [4, 3.2, 2],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..x....xxxx.....xxxxxxxxxxxxxxx
xs.x.............xxxxxxxxxxxxxxx
xx.xyxx.xxxxx....xxxxxxxxxxxxxxx
xxyx.xx.x...x...xxxxxxxxxxxxxxxx
xx...xx.x.c.x..................x
xxxxxxx.xyxyx..................x
xxxxxxx.x.x........xx.......xx.x
xxxxxxx.x.x....axxxxx...x...xx.x
xxxxxxxyxyxxxxxxxxxxx.......xx.x
xxxxxxx.x.xxxxxxxxxxx.......xx.x
xxxxxxx.x......x............xx.x
xxxx1xx.x....c.x.......c....xx.x
xxxxzxx.xxxxxx...xyxxxxxxxxxxx.x
xxx.....xxxxxxxxxx.xxxxxxxxxxx.x
x11................xt..........x
xxxxxxxxxxx.................a..x
xxxxxxxxxxxxxllxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..x....xxxx.....xxxxxxxxxxxxxxx
xs.x.............xxxxxxxxxxxxxxx
xx.xyxx.xxxxx....xxxxxxxxxxxxxxx
xxyx.xx.x...x...xxxxxxxxxxxxxxxx
xx...xx.x.d.x..................x
xxxxxxx.xyxyx..................x
xxxx1xx.x.x........xx.......xx.x
xxxx.xx.x.x....exxxxx...x...xx.x
xxxx.xxyxyxxxxxxxxxxxlllllllxx.x
xxxx.xx.x.xxxxxxxxxxxxxxxxxxxx.x
xxxx.xx.x......x............xx.x
xxxx.xx.x....d.x.......d....xx.x
xxxx.xx.xxxxxx...xyxxxxxxxxxxx.x
xxx.....xxxxxxxxxx.xxxxxxxxxxx.x
x11................x...........x
xxxxxxxxxxx.................a.tx
xxxxxxxxxxxxxlllxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..x....xxxx.................2xx
xs.x.........................2xx
xx.xyxx.xxxxx................2xx
xxyx.xx.x...x...xxxxxxxxxxxxxxxx
xt...xx.x.d.xx.................x
xxxxxxx.xyxyxx.................x
xxxx2xxyx.x........xx...f...xx.x
xxxx.xx.x.x.......exx...x...xx.x
xxxx.xx.xyxxxxxxxxxxxlllllllxx.x
xxxx.xx.x.xxxxxxxxxxxxxxxxxxxx.x
xxxx.xxzx.1........xxxxxxxxxxx.x
xxxx.xx.x.1........xxxxxxxxxxx.x
xxxx.xx.xxxxxxxxxyyxxxxxxxxxxx.x
xxx.....xxxxxxxxx..xxxxxxxxxxx.x
x11................x...........x
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
		2: { kind: 'turret', health: 5 },
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
