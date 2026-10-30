import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelCombat: LevelDef = {
	displayName: 'Combat Level',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxx..xxxxxxxxxxxxxx
xx............xx..xxxxxxxxxxxxxx
xx............xx.xxxxxxxxxxxxxxx
xx.s..........xx.xxxxxxxxxxxxxxx
xx.xxxxxxxxxx.xx..xxxxxxxxxxxxxx
x...xxxx......xx..xxxxxxxxxxxxxx
x...xxxx..1...xxx.xxxxxxxxxxxxxx
xxxxxxxx.xxxxxxxx.xxxxxxxxxxxxxx
xxxx.........xxx..xxxxxxxxxxxxxx
xxxx.1....1..xxx..xxxxxxxxxxxxxx
xxxxxxxxxxxx.xxx.xxxxxxxxxxxxxxx
xxxxxxxx.........xxxxxxxxxxxxxxx
xxxxxxxx.1......1xxxxxxxxxxxxxxx
xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		1: { kind: 'man', health: 3, speed: 21 },
	},
}
