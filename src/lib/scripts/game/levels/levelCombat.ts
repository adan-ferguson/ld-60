import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelCombat: LevelDef = {
	displayName: 'Combat Level',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.............x........xxxxxxxxx
xs.....................xxxxxxxxx
xx............xx.xxxxxxxxxxxxxxx
xx.......3....xx.xxxxxxxxxxxxxxx
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
		1: { kind: 'runnerMan', health: 3, speed: 21 },
		2: { kind: 'shooterMan', health: 3 },
		3: { kind: 'shooterMan', health: 3, facing: -1 },
		a: { kind: 'turret', health: 3 },
		l: { kind: 'lava' },
	},
}
