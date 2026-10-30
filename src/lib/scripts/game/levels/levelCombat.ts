import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelCombat: LevelDef = {
	displayName: 'Combat Level',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xx............x........xxxxxxxxx
xx.....................xxxxxxxxx
xx............xx.xxxxxxxxxxxxxxx
xx..s.......1.xx.xxxxxxxxxxxxxxx
xx.xxxxxxxxxx.xx..xxxxxxxxxxxxxx
xx.xxxxxx.....xx..xxxxxxxxxxxxxx
xx2xxxxxx2....xxx.xxxxxxxxxxxxxx
xxxxxxxxxxxx.xxxx.xxxxxxxxxxxxxx
xxt........x.xxx..xxxxxxxxxxxxxx
xx.........x.xxx..xxxxxxxxxxxxxx
xx.........x.xxx.xxxxxxxxxxxxxxx
xx...............xxxxxxxxxxxxxxx
xx2..............xxxxxxxxxxxxxxx
xxx..xx...xxxxxxxxxxxxxxxxxxxxxx
xxllllllllxxxxxxxxxxxxxxxxxxxxxx
xxllllllllxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		1: { kind: 'man', health: 3, speed: 21 },
		2: { kind: 'man', health: 3, behavior: 'stand' },
		a: { kind: 'turret', health: 3 },
		l: { kind: 'lava' },
	},
}
