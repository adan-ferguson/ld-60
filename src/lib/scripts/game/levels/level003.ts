import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level003: LevelDef = {
	displayName: 'Moving Blocks 1',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x2.............1..............3x
x..t.........b...a..........t..x
x..........xxxxxxxxxx.......x..x
x..............1...............x
x.......................x......x
x..............................x
x..............................x
x..................xx..........x
x..................xx..........x
x..................xx..........x
x..................xx..........x
x..................xx..........x
x.........m........xx..........x
x...xn.............xx....c....2x
x..................xx....xx....x
xs................mxx.........3x
xxxxxxxxxxxxxxxxxxxxxllllllllllx
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
		m: { kind: 'movingBlock', axis: 'y', range: [-5, 0] },
		n: { kind: 'movingBlock', axis: 'x', range: [0, 5] },
	},
}
