import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelClimb: LevelDef = {
	displayName: 'Climbing',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.............................tx
x2.............2..............2x
x..............................x
x..............................x
x......1...............1.......x
x..............................x
x..............................x
x..............1...............x
x..............................x
x..............................x
x..............................x
x..............1...............x
x.............313..............x
x............33133.............x
x...........3331333............x
x..s.......333313333...........x
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
		3: { kind: 'turret', loop: 1 },
		a: { kind: 'man' },
		b: { kind: 'man', loop: [2, 3] },
		c: { kind: 'man', loop: [3] },
	},
}
