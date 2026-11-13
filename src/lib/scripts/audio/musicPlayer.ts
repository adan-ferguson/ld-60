export type SongName = 'bossfight'

type SongDef = {
	leadin?: string
	main: string
}

type PreloadedSong = {
	leadin?: AudioBuffer
	main: AudioBuffer
}

const songDefs: Record<SongName, SongDef> = {
	bossfight: {
		leadin: 'bossfightleadin.ogg',
		main: 'bossfight.ogg',
	},
}

const songCache = new Map<SongName, PreloadedSong>()
let currentAudio: AudioContext | undefined

function getAudioContext() {
	return (currentAudio ??= new AudioContext())
}

async function loadBuffer(filename: string): Promise<AudioBuffer> {
	const response = await fetch(`/assets/music/${filename}`)
	if (!response.ok) {
		throw new Error(`Failed to load music: ${filename}`)
	}

	return getAudioContext().decodeAudioData(await response.arrayBuffer())
}

let currentSources: AudioBufferSourceNode[] = []

export const MusicPlayer = {
	async play(songName: SongName) {
		stop()
		const song = songCache.get(songName)
		if (!song) {
			throw new Error(`Music was not preloaded: ${songName}`)
		}
		const ctx = getAudioContext()
		await ctx.resume()
		const startTime = ctx.currentTime + 0.05
		const main = ctx.createBufferSource()
		main.buffer = song.main
		main.loop = true
		main.connect(ctx.destination)
		if (song.leadin) {
			const leadin = ctx.createBufferSource()
			leadin.buffer = song.leadin
			leadin.connect(ctx.destination)
			leadin.start(startTime)
			main.start(startTime + song.leadin.duration)
			currentSources = [leadin, main]
		} else {
			main.start(startTime)
			currentSources = [main]
		}
	},
	async preload() {
		await Promise.all(
			Object.entries(songDefs).map(async ([name, definition]) => {
				const [leadin, main] = await Promise.all([
					definition.leadin ? loadBuffer(definition.leadin) : undefined,
					loadBuffer(definition.main),
				])
				songCache.set(name as SongName, {
					leadin,
					main,
				})
			}),
		)
	},
	stop,
}

function stop() {
	for (const source of currentSources) {
		source.stop()
		source.disconnect()
	}
	currentSources = []
}
