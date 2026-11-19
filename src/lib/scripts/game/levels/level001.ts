import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level001: LevelDef = {
	displayName: 'Turret Tantrum',
	treasureSpawnTime: [5, 3, 0.1],

	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x..............................x
x..............................x
x..............................x
xs............................tx
xx............................xx
x..............................x
x....xx..................xx....x
x....xx.......x11x.......xx....x
x.............xxxx.............x
x........xxx..xxxx..xxx........x
x........x1x........x1x........x
x....xx..................xx....x
x....xx..................xx....x
xxx..........................xxx
xx1..........................1xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x..............................x
x..............................x
x..............................x
xs............................tx
xx............................xx
x1............................1x
x....xx..................xx....x
x....xx.......x11x.......xx....x
x.........a...xxxx...a.........x
x........xxx..x11x..xxx........x
x........x1x........x1x........x
x....xx..................xx....x
x....xx..................xx....x
xxx..........................xxx
xx1a.................a.......1xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1.............11.............1x
x..............................x
x..............................x
x..............................x
xs............................tx
xx............................xx
x1............................1x
x....xx..................xx....x
x....xx.......x11x.......xx....x
x.........a...xxxx...a.........x
x........xxx..x11x..xxx........x
x........x1x........x1x........x
x....xx..................xx....x
xb...xx..................xx...cx
xxx..........................xxx
xx1a..................a......1xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		l: { kind: 'lava' },
		1: { kind: 'turret' },
		a: { kind: 'runnerMan' },
	},
}
