import { CoolAudio } from '#lib/scripts/audio/coolAudio.ts'

type Sfx = {
	buffer: AudioBuffer
	duration?: number
	volume: number
	loop: boolean
}

type SfxDef = {
	filename: string
	duration?: number
	volume?: number
	loop?: boolean
}

const sfxDefs = {
	bossAttack: { filename: 'bossattack.ogg' },
	bossKill: { filename: 'bosskill.ogg' },
	damage: { filename: 'damage2.ogg' },
	enemyDeath: { filename: 'damage.ogg', volume: 0.7 },
	playerDeath: { filename: 'dead.ogg' },
	enemyShoot: { filename: 'playershoot.ogg' },
	playerShoot: { filename: 'playershoot.ogg', volume: 0.7 },
	jumpGround: { filename: 'jump1.ogg', volume: 0.5 },
	jumpAir: { filename: 'jump2.ogg', volume: 0.5 },
	land: { filename: 'land2.ogg', volume: 0.4 },
	win: { filename: 'win.ogg' },
	scoreCounting: { filename: 'scorecount.ogg', loop: true },
	treasure: { filename: 'treasure.ogg' },
	extraLife: { filename: 'extralife.ogg', volume: 0.5 },
	projhit: { filename: 'enemyshoot.ogg' },
} satisfies Record<string, SfxDef>

type SfxName = keyof typeof sfxDefs

const BASE_SFX_VOLUME = 0.35

const sfxCache = new Map<SfxName, Sfx>()

export const SfxPlayer = {
	async preload() {
		await Promise.all([
			...Object.keys(sfxDefs).map(async (key) => {
				const name = key as SfxName
				const def = sfxDefs[name] as SfxDef
				const buffer = await CoolAudio.loadBuffer(`/assets/sfx/${def.filename}`)
				sfxCache.set(name as SfxName, {
					buffer,
					duration: def.duration,
					volume: BASE_SFX_VOLUME * (def.volume ?? 1),
					loop: def.loop ?? false,
				})
			}),
		])
	},
	play(sfxName: SfxName, pan: number = 0) {
		const sfx = sfxCache.get(sfxName)
		if (!sfx) {
			throw new Error(`Sfx was not preloaded: ${sfxName}`)
		}
		return CoolAudio.play(sfx.buffer, 'sfx', {
			duration: sfx.duration,
			volume: sfx.volume,
			pan,
			loop: sfx.loop,
		})
	},
}
