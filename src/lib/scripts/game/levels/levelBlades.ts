import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelBlades: LevelDef = {
	displayName: 'Blades',
	treasureSpawnTime: 10,
	turretShotTime: [6, 4, 2],
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...x.......a.....a.....a......x
x...x..........................x
x...a..........................x
x.s......a.....a.....a.........x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx..x
xc...d.........xx1.............x
xc...d.........xt1.............x
xc...d.........xx1...........xxx
xc.a.d.cbaaaa..xx1.........aaxxx
xc.a...cbaaaa.xxx1.......xxxxxxx
xc.xxxxxxxxxx.aax1.....aaxxxxxxx
xc.aaaaaxxxxx........xxxxxxxxxxx
xc.........cx.e....aaxxxxxxxxxxx
xc.........cxxxxxxxxxxxxxxxxxxxx
xc..baxxaadcxxxxxxxxxxxxxxxxxxxx
xc.caax1...cxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		1: { kind: 'turret' },
		v: { kind: 'movingBlock', isX: false },
		w: { kind: 'movingBlock', isX: true },
		a: { kind: 'spikes' },
		b: { kind: 'spikes', loop: [2, 3] },
		c: { kind: 'spikes', loop: [3] },
		d: { kind: 'spikes', loop: [2] },
		l: { kind: 'lava' },
		e: { kind: 'runnerMan', facing: -1 },
	},
}
