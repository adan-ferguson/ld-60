import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level003: LevelDef = {
	displayName: 'Platform Picnic',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xt.....................xxxxxxxxx
x............b.....a...x1.....xx
x............xxxxxxxxx.xx.....xx
x.1..................x.xx.....xx
x....................x.x......xx
x....1.....x.....1...x.x......xx
x....................x.x......xx
x.......x.....1.....1x.xx.....xx
x....................x........xx
x..........x.....1...x........xx
x....................x.s......xx
x.......x.....x.....xx.xx.....xx
x.......x............x.xx.....xx
x....x..x........x...x.xx.....xx
x.......x..............xx.....xx
x.......x..............xxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		u: { kind: 'treasureSpawn', loop: [2, 3] },
		x: { kind: 'wall' },
		y: { kind: 'wall', loop: [2, 3] },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', loop: [2, 3] },
		3: { kind: 'turret', loop: [3] },
		a: { kind: 'man' },
		b: { kind: 'man', loop: [2, 3] },
		c: { kind: 'man', loop: [3] },
	},
}
