import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelCombat: LevelDef = {
	displayName: 'Combat Level',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x.............................xx
xs............................xx
xx............xx..xx..........xx
xx...........xxx..xxx.........xx
xx...........xxx..xxx.........xx
x............xxx.xxxx.........xx
x1......3....xxx.xxxx3......3.xx
xx.xxxxxxxxx.xxx..xxxxxxxxxxx.xx
xx...........xxx..xxx.........xx
xx...........xxxx.xxx.........xx
xx...........xxxx.xxx.........xx
xx................xxx.........xx
xx1..............2xxx.........xx
xxx..xx...xxxx.xxxxxx.........xx
xxllllllllxxxx.xxxxx.....4....xx
xxllllllllxxxx.......xxxxxxxxlxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		1: { kind: 'shooterMan', health: 3, facing: 1 },
		2: { kind: 'shooterMan', health: 3, facing: -1 },
		3: { kind: 'runnerMan', health: 3 },
		4: { kind: 'runnerMan', health: 5, speed: 45 },
		a: { kind: 'turret' },
		l: { kind: 'lava' },
	},
}
