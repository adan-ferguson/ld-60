export type SongName = 'bossfight'

type SongDef = {
	leadin?: string
	main: string
}

type PreloadedSong = {
	leadin?: HTMLAudioElement
	main: HTMLAudioElement
}

const songDefs: Record<SongName, SongDef> = {
	bossfight: {
		leadin: 'bossfightleadin.ogg',
		main: 'bossfight.ogg',
	},
}

const songCache = new Map<SongName, PreloadedSong>()

let currentSong: PreloadedSong
let currentAudio: HTMLAudioElement | undefined

export const MusicPlayer = {
	play(songName: SongName) {
		MusicPlayer.stop()
		const song = songCache.get(songName)
		if (!song) {
			throw new Error(`Music was not preloaded: ${songName}`)
		}
		currentSong = song
		song.main.loop = true
		song.main.currentTime = 0
		if (song.leadin) {
			song.leadin.currentTime = 0
			song.leadin.addEventListener(
				'ended',
				() => {
					if (currentSong === song) {
						play(song.main)
					}
				},
				{ once: true },
			)
			play(song.leadin)
		} else {
			play(song.main)
		}
	},
	async preload() {
		await Promise.all(
			Object.entries(songDefs).map(async ([name, definition]) => {
				const audio: PreloadedSong = {
					leadin: definition.leadin ? await preloadAudio(definition.leadin) : undefined,
					main: await preloadAudio(definition.main),
				}
				songCache.set(name as SongName, audio)
			}),
		)
	},
	stop() {
		currentAudio?.pause()
		currentAudio = undefined
	},
}

function preloadAudio(src: string): Promise<HTMLAudioElement> {
	const audio = new Audio(`/assets/music/${src}`)
	audio.preload = 'auto'
	return new Promise((resolve, reject) => {
		audio.addEventListener('canplaythrough', () => resolve(audio), { once: true })
		audio.addEventListener('error', () => reject(audio.error), { once: true })
		audio.load()
	})
}

function play(audio: HTMLAudioElement) {
	currentAudio = audio
	void audio.play()
}
