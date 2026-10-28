import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level003: LevelDef = {
	displayName: 'Platform Picnic',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1x............................x
x............b.....a...........x
x............xxxxxxxxx....x....x
x.......x....1......tx.........x
x....................x.........x
x...x................x..x...x..x
x....................x.........x
x.......x............x.........x
x....................xx...1...xx
x...........x........x.........x
x....................x.........x
x.......x.......x....x..x...x..x
x.......x.......1....x.........x
x...x...x...........xx.........x
x.......x............x....x....x
xs......x............x.........x
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
