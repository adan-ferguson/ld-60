import { CoolAudio } from '#lib/scripts/audio/coolAudio.ts'

type Music = {
	leadin?: AudioBuffer
	main: AudioBuffer
	loop?: boolean
	fast?: AudioBuffer
}

type MusicDef = {
	leadin?: string
	main: string
	loop?: boolean
	fast?: string
}

const SONG_NAMES = [
	'bossfight',
	'spawn',
	'win',
	'dead',
	'level1',
	'level2',
	'level3',
	'hurry',
] as const
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
	dead: {
		main: 'dead.ogg',
	},
	level1: {
		main: 'stage2.ogg',
		loop: true,
	},
	level2: {
		main: 'stage2.ogg',
		fast: 'stage2fast.ogg',
		loop: true,
	},
	level3: {
		main: 'stage2.ogg',
		loop: true,
	},
	hurry: {
		main: 'hurry.ogg',
	},
} as const

const songCache = new Map<SongName, Music>()

export const MusicPlayer = {
	async preload() {
		const toUrl = (filename: string) => `/assets/music/${filename}`
		await Promise.all([
			...Object.entries(songDefs).map(async ([name, definition]) => {
				const [leadin, main] = await Promise.all([
					definition.leadin ? CoolAudio.loadBuffer(toUrl(definition.leadin)) : undefined,
					CoolAudio.loadBuffer(toUrl(definition.main)),
					definition.fast ? CoolAudio.loadBuffer(toUrl(definition.fast)) : undefined,
				])
				songCache.set(name as SongName, {
					leadin,
					main,
					loop: definition.loop,
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
