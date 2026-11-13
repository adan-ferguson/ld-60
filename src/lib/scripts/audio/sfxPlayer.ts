import { CoolAudio } from '#lib/scripts/audio/coolAudio.ts'

type Sfx = {
	buffer: AudioBuffer
	duration?: number
}

type SfxDef = {
	filename: string
	duration?: number
}

const SFX_NAMES = ['treasure', 'extraLife'] as const
type SfxName = (typeof SFX_NAMES)[number]
const sfxDefs: Record<SfxName, SfxDef> = {
	treasure: {
		filename: 'treasure.ogg',
	},
	extraLife: {
		filename: 'extralife.ogg',
	},
} as const

const sfxCache = new Map<SfxName, Sfx>()

export const SfxPlayer = {
	async preload() {
		await Promise.all([
			...Object.entries(sfxDefs).map(async ([name, definition]) => {
				const buffer = await CoolAudio.loadBuffer(`/assets/sfx/${definition.filename}`)
				sfxCache.set(name as SfxName, {
					buffer,
					duration: definition.duration,
				})
			}),
		])
	},
	play(sfxName: SfxName) {
		const sfx = sfxCache.get(sfxName)
		if (!sfx) {
			throw new Error(`Sfx was not preloaded: ${sfxName}`)
		}
		CoolAudio.play(sfx.buffer, 'sfx', {
			duration: sfx.duration,
		})
	},
}
