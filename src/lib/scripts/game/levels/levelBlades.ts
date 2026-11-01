import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelBlades: LevelDef = {
	displayName: 'Blades',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...x.......b.....b.....b...1..x
x...x.......................1..x
x...a.......................1..x
xs.......a.....a.....a......1..x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx..x
x..............xx1.............x
x..............xt1.............x
x..............xx1..........xxxx
x........aaaa..xx1.........aaxxx
x....e...xxxx.xxx1.......xxxxxxx
x.xxxxxxxxxxx.aax1.....aaxxxxxxx
x.bbbbbbbbbxx........xxxxxxxxxxx
x..........xx.e....aaxxxxxxxxxxx
x..........xxxxxxxxxxxxxxxxxxxxx
x..........xxxxxxxxxxxxxxxxxxxxx
x..e..e..e.xxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		x: { kind: 'wall' },
		1: { kind: 'turret' },
		v: { kind: 'movingBlock', isX: false },
		w: { kind: 'movingBlock', isX: true },
		a: { kind: 'spikes' },
		b: { kind: 'spikes', loop: [2, 3] },
		l: { kind: 'lava' },
		e: { kind: 'runnerMan', facing: -1 },
	},
}
