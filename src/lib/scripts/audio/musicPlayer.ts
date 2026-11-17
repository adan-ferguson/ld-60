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

const SONG_NAMES = ['bossfight', 'spawn', 'win', 'level1', 'level2', 'level3', 'hurry'] as const
export type SongName = (typeof SONG_NAMES)[number]
const songDefs: Record<SongName, MusicDef> = {
	bossfight: {
		leadin: 'bossfightleadin.ogg',
		main: 'bossfight.ogg',
		loop: true,
	},
	spawn: {
		main: 'spawn.ogg',
	},
	win: {
		main: 'win.ogg',
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
} as const

const songCache = new Map<SongName, Music>()

const BASE_MUSIC_VOLUME = 0.25

export const MusicPlayer = {
	async preload() {
		const toUrl = (filename: string) => `/assets/music/${filename}`
		await Promise.all([
			...Object.entries(songDefs).map(async ([name, definition]) => {
				const [leadin, main, fast] = await Promise.all([
					definition.leadin ? CoolAudio.loadBuffer(toUrl(definition.leadin)) : undefined,
					CoolAudio.loadBuffer(toUrl(definition.main)),
					definition.fast ? CoolAudio.loadBuffer(toUrl(definition.fast)) : undefined,
				])
				songCache.set(name as SongName, {
					leadin,
					main,
					fast,
					loop: definition.loop,
					volume: (definition.volume ?? 1) * BASE_MUSIC_VOLUME,
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
