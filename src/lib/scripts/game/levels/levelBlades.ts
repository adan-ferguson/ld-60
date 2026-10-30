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
x...............x1.............x
x...............x1.............x
x...............x1..........txxx
x...........aa..x1.........aaxxx
x....e......xx.xx1.......xxxxxxx
x.xxxxxxxxx.xx.ax1.....aaxxxxxxx
x.bbbbbbbbb.xx.......xxxxxxxxxxx
x...........xx.e...aaxxxxxxxxxxx
x..e.....e..xxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
		e: { kind: 'man', facing: -1 },
	},
}
