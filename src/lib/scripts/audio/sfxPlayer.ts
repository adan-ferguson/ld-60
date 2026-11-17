import { CoolAudio } from '#lib/scripts/audio/coolAudio.ts'

type Sfx = {
	buffer: AudioBuffer
	duration?: number
	volume: number
}

type SfxDef = {
	filename: string
	duration?: number
	volume?: number
}

const SFX_NAMES = [
	'damage',
	'enemyDeath',
	'playerDeath',
	'enemyShoot',
	'playerShoot',
	'jumpGround',
	'jumpAir',
	'land',
	'scoreCounting',
	'treasure',
	'extraLife',
	'win',
	'projhit',
] as const
type SfxName = (typeof SFX_NAMES)[number]
const sfxDefs: Record<SfxName, SfxDef> = {
	damage: {
		filename: 'damage2.ogg',
	},
	enemyDeath: {
		filename: 'damage.ogg',
	},
	playerDeath: {
		filename: 'dead.ogg',
	},
	enemyShoot: {
		filename: 'playershoot.ogg',
	},
	playerShoot: {
		filename: 'playershoot.ogg',
	},
	jumpGround: {
		filename: 'jump1.ogg',
	},
	jumpAir: {
		filename: 'jump2.ogg',
	},
	land: {
		filename: 'land2.ogg',
	},
	win: {
		filename: 'win.ogg',
	},
	scoreCounting: {
		filename: 'scorecount.ogg',
	},
	treasure: {
		filename: 'treasure.ogg',
	},
	extraLife: {
		filename: 'extralife.ogg',
	},
	projhit: {
		filename: 'enemyshoot.ogg',
	},
} as const

const BASE_SFX_VOLUME = 0.45

const sfxCache = new Map<SfxName, Sfx>()

export const SfxPlayer = {
	async preload() {
		await Promise.all([
			...Object.entries(sfxDefs).map(async ([name, definition]) => {
				const buffer = await CoolAudio.loadBuffer(`/assets/sfx/${definition.filename}`)
				sfxCache.set(name as SfxName, {
					buffer,
					duration: definition.duration,
					volume: BASE_SFX_VOLUME * (definition.volume ?? 1),
				})
			}),
		])
	},
	play(sfxName: SfxName, pan: number = 0) {
		const sfx = sfxCache.get(sfxName)
		if (!sfx) {
			throw new Error(`Sfx was not preloaded: ${sfxName}`)
		}
		CoolAudio.play(sfx.buffer, 'sfx', {
			duration: sfx.duration,
			volume: sfx.volume,
			pan,
		})
	},
}
