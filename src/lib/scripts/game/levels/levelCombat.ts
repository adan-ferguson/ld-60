import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelCombat: LevelDef = {
	displayName: 'Tough Mans',
	treasureSpawnTime: [20, 25, 30],
	phantaSpawnTime: 60,
	turretShotTime: [4, 3, 2],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxsx................xxxxxxx
xxxxxxxzx................xxxxxxx
xx............xxxxxxxxxx.xxxxxxx
xx...........xxxxxxyyyyy.yyyyyxx
xx...........xxxxxx..........2xx
xx...........xxxxxxyyyyyyyyyyyxx
xx......3....xxxx............2xx
xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxx
xx................xxxxxxxxxxxxxx
xx................xxxxxxxxxxxxxx
xx................x..........txx
xx1...........................xx
xxx...x...xxxxxxxxx...........xx
xx........xxxxxxxxx.3.........xx
xxllllllllxxxxxxxxxxxxxxxxxxxlxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxsx................xxxxxxx
xxxxxxxzx................xxxxxxx
xxa.........axxxxxxxxxxx.xxxxxxx
xx...........xxxxxxyyyyy.yyyyyxx
xx...........xxxxxx..........8xx
xx...........xxyxxxyyyyyyyyyyyxx
xxa.....6...axxxx..7..........xx
xxxxxxxxxxxxlxxxx.xxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxx
xx................xxxxxxxxxxxxxx
xx................x..........txx
xx7...........................xx
xxx...x...xxxxxxxxx...........xx
xx........xxxxxxxxx.6.6.......xx
xxllllllllxxxxxxxxxxxxxxxxxxxlxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxsx................xxxxxxx
xxxxxxxzx................xxxxxxx
xxa.........axxxxxxxxxxx.xxxxxxx
xx...........xxxxxxyyyyy.yyyyyxx
xx...........xxxxxx7.........8xx
xx...........xxxxxxyyyyyyyyyyyxx
xxa.....c...axxxx..7.........8xx
xxxxxxxxxxxxlxxxx.xxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxx
xx................xxxxxxxxxxxxxx
xx................x..........txx
xxd...........................xx
xxx...x...xxxxxxxxx...........xx
xx........xxxxxxxxx.c.c.c.....xx
xxllllllllxxxxxxxxxxxxxxxxxxxlxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn' },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		z: { kind: 'thinFloor', position: 'bottom' },
		1: { kind: 'shooterMan', health: 4, facing: 1 },
		2: { kind: 'shooterMan', health: 4, facing: -1 },
		3: { kind: 'runnerMan', health: 4, speed: 35 },
		6: { kind: 'runnerMan', health: 7, speed: 35 },
		7: { kind: 'shooterMan', health: 7, facing: 1 },
		8: { kind: 'shooterMan', health: 7, facing: -1 },
		a: { kind: 'turret' },
		l: { kind: 'lava' },
		b: { kind: 'spikes' },
		c: { kind: 'runnerMan', health: 7, speed: 45 },
		d: { kind: 'shooterMan', health: 7, facing: 1, speed: 0.35 },
	},
}
