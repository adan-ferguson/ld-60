import type { LevelDef } from '#lib/scripts/game/levelDef.ts'

export const Level001: LevelDef = {
	id: '001',
	displayName: 'Level 1',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x..............................x
x..............................x
x..............................x
x..............................x
x..............................x
x..............1..............xx
x..............................x
xs.......................xx....x
xx...........xx1xx.......xx....x
x............xxxxx.............x
x........xx..xx1xx..xxx........x
x........xx.........xxx........x
x....xx..................xx....x
x....xx........1.........xx....x
xxx..........................xxx
xx1..........................1xx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
`,
}

export const Level004: LevelDef = {
	id: '001',
	displayName: 'Level 1',
	tiles: `
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
x1............................1x
x..............................x
x...xxxxxxxx...xxxxxxxxxxx.....x
x...xxxxxxxx...xxxxxxxxxxx.....x
x...xx..................xx....xx
x...xx.1..............1.xx.....x
x...xx..................xx.....x
x...xx.........................x
x...xx.........................x
x...1x..................xx....1x
x...xx.....xx.....xx....xxxxxxxx
x..........xx.....xx....xxxxxxxx
x..........xx..................x
x..........xx..................x
x..x...xxxxxx..................x
x..x.s.xxxxxx..................x
xxxxxxxxxxxxxRRRRRRRRRRRRRRRRRRx
`,
}
