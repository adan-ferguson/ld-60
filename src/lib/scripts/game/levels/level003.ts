import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level003: LevelDef = {
	displayName: 'Level 3',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x2.............1..............3x
x..t.........b...a..........t..x
x..x.......xxxxxxxxxx.......x..x
x..............1...............x
x......x................x......x
x..............................x
x..........x........x..........x
x..............b...............x
x..............xx..............x
x...................t..........x
x..........x.......xx..........x
x..................xx..........x
x......x...........xx..........x
xts................x1....c....2x
xxxx...............xx....xx....x
xxxx...b....a......1x.........3x
xxxxxxxxxxxxxxxxxxxxxllllllllllx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		u: { kind: 'treasureSpawn', minLoop: 2 },
		x: { kind: 'wall' },
		y: { kind: 'wall', minLoop: 2 },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		2: { kind: 'turret', minLoop: 2 },
		3: { kind: 'turret', minLoop: 3 },
		a: { kind: 'man' },
		b: { kind: 'man', minLoop: 2 },
		c: { kind: 'man', minLoop: 3 },
	},
}
