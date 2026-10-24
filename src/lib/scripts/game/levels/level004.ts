import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level004: LevelDef = {
	displayName: 'Level 4',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.............11...............x
x...........................s..x
x...2.....................xxxxxx
x..........................x.3.x
x...t.........b................x
x.............xx...............x
x........xx...xx....xx.....x...x
xlllll...xx.........xx.....x...x
xxxxxx...xx....................x
x.1.xx...xx...a............t...x
x...xx........xx.....t.....x.3.x
x.............xx....xx.....x...x
x........c..........xx.....x...x
x........xx.........xx...x.x...x
x.t.xx...xx...c.....1x.....x...x
x...xx.2.xx...xx....xx.....x...x
xllllllllllllllllllllllllllllllx
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
