import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelTight: LevelDef = {
	displayName: 'Tight Spaces',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...xxxxxxxxxxxxxxxxxxxxx...xxxx
x.s.........xxxxxxxxxxxxx...xxxx
xxxx.xxxxxxxxxxxxxxxxxxxx.xxxxxx
xxxx....xxxxxxx.......xxx.xxxxxx
x1t.....xx....x...........xxxxxx
xxxxxxx.xx....xxxxxxxxxxxxxxxxxx
xxxxxxx.xx....xxxxxxxxxxxxxxxxxx
xxx1..........xxxxxxxxxxxxxxxxxx
xxxxxxx.......xxxxxxxxxxxxxxxxxx
xxxxxxx..xxxxxxxxxxxxxxxxxxxxxxx
xxxxxxx..xxxxxxxxxxxxxxxxxxxxxxx
xxxxxxx..xxxxxxxxxxxxxxxxxxxxxxx
xxxxxxx..xxxxxxxxxxxxxxxxxxxxxxx
xxxxxxx..xxxxxxxxxxxxxxxxxxxxxxx
x1.......xxxxxxxxxxxxxxxxxxxxxxx
xxxx.....xxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
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
