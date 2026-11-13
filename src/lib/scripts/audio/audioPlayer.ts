let currentAudio: AudioContext | undefined

function getAudioContext() {
	return (currentAudio ??= new AudioContext())
}

let currentSources: AudioBufferSourceNode[] = []

type PlayOptions = {
	loop?: boolean
	channel?: 'song' | 'sfx'
	overlap?: boolean
}

export const AudioPlayer = {
	async loadBuffer(filename: string): Promise<AudioBuffer> {
		const response = await fetch(`/assets/music/${filename}`)
		if (!response.ok) {
			throw new Error(`Failed to load music: ${filename}`)
		}

		return getAudioContext().decodeAudioData(await response.arrayBuffer())
	},
	async play(coolAudio: AudioBuffer | AudioBuffer[], options: PlayOptions = {}) {
		stop()
		const ctx = getAudioContext()
		await ctx.resume()
		let startTime = ctx.currentTime + 0.05
		currentSources.length = 0
		const buffers = Array.isArray(coolAudio) ? coolAudio : [coolAudio]
		buffers.forEach((buffer, i) => {
			const source = ctx.createBufferSource()
			source.buffer = buffer
			source.loop = i === buffers.length - 1 && !!options.loop
			source.connect(ctx.destination)
			source.start(startTime)
			startTime += buffer.duration
			currentSources.push(source)
		})
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
