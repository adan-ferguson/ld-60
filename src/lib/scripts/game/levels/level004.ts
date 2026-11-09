import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level004: LevelDef = {
	displayName: 'Lava Lake',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x...........................s..x
x.........................xxxxxx
x..........................x.1.x
x...t.........a............x...x
x.............xx...............x
x........xx...xx....xx.........x
xlllll...xx.........xx.....x...x
xxxxxx...xx................x...x
x.1.xx...xx....................x
x...xx........xx...............x
x.............xx....xx.....x...x
x........c..........xx.....x...x
x........xx.........xx...x.x...x
x...xx...x1...c.....xx.....x...x
x...xx.2.xx...xx....xx.....x...x
xllllllllllllllllllllllllllllllx
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
		a: { kind: 'shooterMan' },
		b: { kind: 'runnerMan', loop: [2, 3] },
		c: { kind: 'runnerMan', loop: [3] },
	},
}
