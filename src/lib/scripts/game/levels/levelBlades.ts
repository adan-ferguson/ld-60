import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelBlades: LevelDef = {
	displayName: 'Blade Bonanza',
	treasureSpawnTime: 10,
	phantaSpawnTime: [60, 60, 42],
	turretShotTime: [6, 5, 4],
	tiles: [
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...x.......a.....a.....a......x
x...x..........................x
x...a..........................x
x.s......a.....a.....a.........x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx..x
x..............xx1.............x
x..............xt1.............x
x..............xx1...........xxx
x..aa.....aaa..xx1..........axxx
x..aaa...aaaa.xxx1.......xxxxxxx
x..xxxxxxxxxx.aax1......axxxxxxx
x..aaaa.....x........xxxxxxxxxxx
x...........x.e.....axxxxxxxxxxx
x...........xxxxxxxxxxxxxxxxxxxx
x...axxaaa..xxxxxxxxxxxxxxxxxxxx
x...ax1.....xxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x...x......a...a...a...a...a...x
x...x..........................x
x...a..........................x
x.s......a...a...a...a...a.....x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx..x
x..............xx2.............x
x..............xx2.............x
x..............xx2...........xxx
x..aaa...aaaa..xx2.........aaxxx
x..aaa...aaaa.xxx2.......xxxxxxx
x..xxxxxxxxxx.aax2.....aaxxxxxxx
x..aaaa.....x........xxxxxxxxxxx
x...........x.e....aaxxxxxxxxxxx
x...........xxxyxxxxxxxxxxxxxxxx
x...axxaaaa.xxx.xxxxxxxxxxxxxxxx
x..aax1.....xxxtxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
		`
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xt....b.....b..................x
x....b.c...b...................x
x...b...c.b....................x
xs.b.....c.......aaaa...aa.aa..x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxx..x
x..............xx3.............x
x..............xx3.............x
x..............xx3...........xxx
x..aaa...aaaa..xx3........aaaxxx
x..aaa...aaaa.xxx3.......xxxxxxx
x..xxxxxxxxxx.aax3....aaaxxxxxxx
x...........x........xxxxxxxxxxx
x...........x.e...aaaxxxxxxxxxxx
x...........xxxxxxxxxxxxxxxxxxxx
x....aaaa.....x..xxxxxxxxxxxxxxx
x...m.......x..f.xxxxxxxxxxxxxxx
xlllllllllllxxxxxxxxxxxxxxxxxxxx
`,
	],
	contents: {
		s: { kind: 'playerSpawn' },
		x: { kind: 'wall' },
		y: { kind: 'thinFloor' },
		1: { kind: 'turret' },
		2: { kind: 'turret', health: 3 },
		3: { kind: 'turret', health: 5 },
		a: { kind: 'spikes' },
		b: { kind: 'movingBlock', isX: false, type: 'spike' },
		c: { kind: 'movingBlock', isX: false, type: 'spike', initialDir: -1 },
		l: { kind: 'lava' },
		m: { kind: 'movingBlock', isX: true, speed: 33 },
		e: { kind: 'runnerMan', facing: -1 },
		f: { kind: 'runnerMan' },
		t: { kind: 'treasureSpawn' },
	},
}
