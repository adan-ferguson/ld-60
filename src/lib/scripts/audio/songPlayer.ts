import { AudioPlayer } from '#lib/scripts/audio/audioPlayer.ts'

type Song = {
	leadin?: AudioBuffer
	main: AudioBuffer
	loop?: boolean
}

type Ditty = {
	buffer: AudioBuffer
	duration?: number
}

type SongDef = {
	leadin?: string
	main: string
	loop?: boolean
}

type DittyDef = {
	name: string
	duration?: number
}

const SONG_NAMES = ['bossfight', 'spawn', 'win', 'dead', 'level1', 'level2', 'level3'] as const
export type SongName = (typeof SONG_NAMES)[number]
const songDefs: Record<SongName, SongDef> = {
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
		loop: true,
	},
	level3: {
		main: 'stage2.ogg',
		loop: true,
	},
} as const

const DITTY_NAMES = ['treasure', 'extraLife'] as const
type DittyName = (typeof DITTY_NAMES)[number]
const dittyDefs: Record<DittyName, DittyDef> = {
	treasure: {
		name: 'treasure.ogg',
	},
	extraLife: {
		name: 'extralife.ogg',
	},
} as const

const songCache = new Map<SongName, Song>()
const dittyCache = new Map<DittyName, Ditty>()

export const SongPlayer = {
	async preload() {
		const songLoaders = Object.entries(songDefs).map(async ([name, definition]) => {
			const [leadin, main] = await Promise.all([
				definition.leadin ? AudioPlayer.loadBuffer(definition.leadin) : undefined,
				AudioPlayer.loadBuffer(definition.main),
			])
			songCache.set(name as SongName, {
				leadin,
				main,
				loop: definition.loop,
			})
		})
		const dittyLoaders = Object.entries(dittyDefs).map(async ([name, definition]) => {
			const buffer = await AudioPlayer.loadBuffer(definition.name)
			dittyCache.set(name as DittyName, {
				buffer,
				duration: definition.duration,
			})
		})
		await Promise.all([...songLoaders, ...dittyLoaders])
	},
	playSong(songName: SongName) {
		const song = songCache.get(songName)
		if (!song) {
			throw new Error(`Music was not preloaded: ${songName}`)
		}
		if (song.leadin) {
			void AudioPlayer.play([song.leadin, song.main], 'song', {
				loop: song.loop,
			})
		} else {
			void AudioPlayer.play(song.main, 'song', {
				loop: song.loop,
			})
		}
	},
	playDitty(dittyName: DittyName) {
		const ditty = dittyCache.get(dittyName)
		if (!ditty) {
			throw new Error(`Ditty was not preloaded: ${dittyName}`)
		}
		// AudioPlayer.mute('song')
		void AudioPlayer.play(ditty.buffer, 'ditty', {
			duration: ditty.duration,
			finished() {
				// AudioPlayer.unmute('song')
			},
		})
	},
	stop() {
		AudioPlayer.stop('song')
	},
}
