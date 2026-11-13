let audioContext: AudioContext | undefined

function getAudioContext() {
	return (audioContext ??= new AudioContext())
}

type ChannelName = 'song' | 'ditty'
const channels = new Map<ChannelName, Channel>()

type PlayOptions = {
	loop?: boolean
	finished?: () => void
}

class Channel {
	sources = new Set<AudioBufferSourceNode>()
	gainNode = getAudioContext().createGain()
	#playbackGeneration = 0
	constructor() {
		this.gainNode.connect(getAudioContext().destination)
	}
	stop() {
		this.#playbackGeneration++
		for (const source of this.sources) {
			source.stop()
			source.disconnect()
		}
		this.sources.clear()
		this.gainNode.gain.value = 1
		return this
	}
	nextPlayback() {
		this.stop()
		return this.#playbackGeneration
	}
	isCurrent(generation: number) {
		return generation === this.#playbackGeneration
	}
}

function getChannel(channelName: ChannelName) {
	if (!channels.has(channelName)) {
		channels.set(channelName, new Channel())
	}
	return channels.get(channelName)!
}

export const AudioPlayer = {
	async loadBuffer(filename: string): Promise<AudioBuffer> {
		const response = await fetch(`/assets/music/${filename}`)
		if (!response.ok) {
			throw new Error(`Failed to load music: ${filename}`)
		}

		return getAudioContext().decodeAudioData(await response.arrayBuffer())
	},
	async play(
		coolAudio: AudioBuffer | AudioBuffer[],
		channelName: ChannelName,
		options: PlayOptions = {},
	) {
		const channel = getChannel(channelName)
		const generation = channel.nextPlayback()
		const ctx = getAudioContext()
		return ctx.resume().then(() => {
			let startTime = ctx.currentTime + 0.05
			const buffers = Array.isArray(coolAudio) ? coolAudio : [coolAudio]
			buffers.forEach((buffer, i) => {
				const isLast = i === buffers.length - 1
				const source = ctx.createBufferSource()
				source.buffer = buffer
				source.loop = isLast && !!options.loop
				source.connect(channel?.gainNode ?? ctx.destination)
				source.start(startTime)
				source.onended = () => {
					channel.sources.delete(source)
					if (isLast && channel.isCurrent(generation)) {
						options.finished?.()
					}
				}
				startTime += buffer.duration
				channel?.sources.add(source)
			})
		})
	},
	mute(channel: ChannelName) {
		getChannel(channel).gainNode.gain.value = 0
	},
	unmute(channel: ChannelName) {
		getChannel(channel).gainNode.gain.value = 1
	},
	stop(channel: ChannelName) {
		getChannel(channel).stop()
	},
}
