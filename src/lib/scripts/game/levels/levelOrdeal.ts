import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const LevelOrdeal: LevelDef = {
	displayName: 'Moving Blocks 2',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x..............................x
x..............................x
x..............................x
x..............................x
x..............................x
x............1x................x
x............1t................x
x............1x................x
x..............................x
x..............................x
x..............................x
x..............................x
x..............................x
x..............................x
x..............................x
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
	contents: {
		s: { kind: 'playerSpawn' },
		t: { kind: 'treasureSpawn', loop: 1 },
		x: { kind: 'wall' },
		1: { kind: 'turret' },
		2: { kind: 'movingBlock', isX: true },
		v: { kind: 'movingBlock', isX: false },
		w: { kind: 'movingBlock', isX: true, range: [-8, 0] },
		l: { kind: 'lava' },
		o: { kind: 'movingBlock', isX: true, speed: 30 },
		a: { kind: 'movingBlock', isX: true, type: 'spike' },
		b: { kind: 'movingBlock', isX: false, type: 'spike' },
		c: { kind: 'man', behavior: 'stand', facing: -1 },
		d: { kind: 'movingBlock', isX: true, type: 'spike', speed: 50 },
		e: { kind: 'man', facing: -1 },
	},
}
