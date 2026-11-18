import { CoolAudio } from '#lib/scripts/audio/coolAudio.ts'

type Music = {
	leadin?: AudioBuffer
	main: AudioBuffer
	fast?: AudioBuffer
	loop?: boolean
	volume: number
}

type MusicDef = {
	leadin?: string
	main: string
	fast?: string
	loop?: boolean
	volume?: number
}

const songDefs = {
	bossfight: {
		leadin: 'bossfightleadin.ogg',
		main: 'bossfight.ogg',
		loop: true,
		volume: 1.2,
	},
	spawn: {
		main: 'spawn.ogg',
	},
	level1: {
		main: 'stage1-v2.ogg',
		fast: 'stage1-v2-fast.ogg',
		loop: true,
	},
	level2: {
		main: 'stage2.ogg',
		fast: 'stage2fast.ogg',
		loop: true,
		volume: 1.25,
	},
	level3: {
		main: 'stage3-v2.ogg',
		fast: 'stage3-v2-fast.ogg',
		loop: true,
	},
	hurry: {
		main: 'hurry.ogg',
		loop: true,
	},
} satisfies Record<string, MusicDef>

export type SongName = keyof typeof songDefs

const songCache = new Map<SongName, Music>()

const BASE_MUSIC_VOLUME = 0.4

export const MusicPlayer = {
	async preload() {
		const toUrl = (filename: string) => `/assets/music/${filename}`
		await Promise.all([
			...Object.keys(songDefs).map(async (key) => {
				const name = key as SongName
				const def = songDefs[name] as MusicDef
				const [leadin, main, fast] = await Promise.all([
					def.leadin ? CoolAudio.loadBuffer(toUrl(def.leadin)) : undefined,
					CoolAudio.loadBuffer(toUrl(def.main)),
					def.fast ? CoolAudio.loadBuffer(toUrl(def.fast)) : undefined,
				])
				songCache.set(name as SongName, {
					leadin,
					main,
					fast,
					loop: def.loop,
					volume: (def.volume ?? 1) * BASE_MUSIC_VOLUME,
				})
			}),
		])
	},
	play(songName: SongName, fastVersion: boolean = false) {
		const song = songCache.get(songName)
		if (!song) {
			throw new Error(`Music was not preloaded: ${songName}`)
		}
		const options = {
			loop: song.loop,
			replace: true,
			volume: song.volume,
		}
		if (fastVersion && song.fast) {
			CoolAudio.play(song.fast, 'song', options)
		} else if (song.leadin) {
			CoolAudio.play([song.leadin, song.main], 'song', options)
		} else {
			CoolAudio.play(song.main, 'song', options)
		}
	},
	stop() {
		CoolAudio.stop('song')
	},
}
