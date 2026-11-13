import { AudioPlayer } from '#lib/scripts/audio/audioPlayer.ts'

type Song = {
	leadin?: AudioBuffer
	main: AudioBuffer
}

type Ditty = {
	buffer: AudioBuffer
}

type SongDef = {
	leadin?: string
	main: string
}

type DittyDef = {
	name: string
}

const songDefs: Record<string, SongDef> = {
	bossfight: {
		leadin: 'bossfightleadin.ogg',
		main: 'bossfight.ogg',
	},
} as const

const dittyDefs: Record<string, DittyDef> = {
	treasure: {
		name: 'treasure.ogg',
	},
} as const

export type SongName = keyof typeof songDefs
export type DittyName = keyof typeof dittyDefs

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
			})
		})
		const dittyLoaders = Object.entries(dittyDefs).map(async ([name, definition]) => {
			const buffer = await AudioPlayer.loadBuffer(definition.name)
			dittyCache.set(name as DittyName, {
				buffer,
			})
		})
		await Promise.all([...songLoaders, ...dittyLoaders])
	},
	async playSong(songName: SongName) {
		const song = songCache.get(songName)
		if (!song) {
			throw new Error(`Music was not preloaded: ${songName}`)
		}
		if (song.leadin) {
			void AudioPlayer.play([song.leadin, song.main], 'song', {
				loop: true,
			})
		} else {
			void AudioPlayer.play(song.main, 'song', {
				loop: true,
			})
		}
	},
	async playDitty(dittyName: DittyName) {
		const ditty = dittyCache.get(dittyName)
		if (!ditty) {
			throw new Error(`Ditty was not preloaded: ${dittyName}`)
		}
		AudioPlayer.mute('song')
		AudioPlayer.play(ditty.buffer, 'ditty', {
			finished() {
				AudioPlayer.unmute('song')
			},
		})
	},
	stop() {
		AudioPlayer.stop('song')
	},
}
