import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelCombat: LevelDef = {
	displayName: 'Tough Mans',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxx.x............xxxxxxxxxxx
xxxxxxxsx............xxxxxxxxxxx
xxyyyyyyy.....xxxyxx.xxxxxxxxxxx
xx...........xxxx.xxyyyyyyyyyyxx
xx...........xxxx.xx........2.xx
xx...........xxxxyxxyyyyyyyyyyxx
xx......3....xxxx.xx........2.xx
xxxxxxxxxxxxyxxxx.xxxxxxxxxxxxxx
xx...........xxxxyxxxxxxxxxxxxxx
xx...........xxxx.xxxxxxxxxxxxxx
xx...........xxxx.xxxxxxxxxxxxxx
xx...........yyyyyxxx.........xx
xx1...........................xx
xxx..xx...xxxxxxxxxxx.........xx
xxllllllllxxxxxxxxxxx....3....xx
xxllllllllxxxxxxxxxxxxxxxxxxxlxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		1: { kind: 'shooterMan', health: 5, facing: 1 },
		2: { kind: 'shooterMan', health: 5, facing: -1 },
		3: { kind: 'runnerMan', health: 5, speed: 35 },
		a: { kind: 'turret' },
		l: { kind: 'lava' },
	},
}
