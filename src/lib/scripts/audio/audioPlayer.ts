let audioContext: AudioContext | undefined

function getAudioContext() {
	return (audioContext ??= new AudioContext())
}

type ChannelName = 'song' | 'ditty'
const channels = new Map<ChannelName, Channel>()

type PlayOptions = {
	loop?: boolean
	finished?: () => void
	duration?: number
}

const VOLUME = 0.8

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
		this.gainNode.gain.value = VOLUME
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
		buffers: AudioBuffer | AudioBuffer[],
		channelName: ChannelName,
		options: PlayOptions = {},
	) {
		const channel = getChannel(channelName)
		const generation = channel.nextPlayback()
		const ctx = getAudioContext()
		return ctx.resume().then(() => {
			if (!channel.isCurrent(generation)) {
				return
			}
			const startTime = ctx.currentTime + 0.01
			const stopTime = options.duration === undefined ? undefined : startTime + options.duration
			let nextStartTime = startTime
			const b = Array.isArray(buffers) ? buffers : [buffers]
			b.forEach((buffer, i) => {
				const isLast = i === b.length - 1
				const source = ctx.createBufferSource()
				source.buffer = buffer
				source.loop = isLast && !!options.loop
				source.connect(channel?.gainNode ?? ctx.destination)
				source.start(nextStartTime)
				if (stopTime !== undefined) {
					source.stop(stopTime)
				}
				source.onended = () => {
					channel.sources.delete(source)
					if (isLast && channel.isCurrent(generation)) {
						options.finished?.()
					}
				}
				nextStartTime += buffer.duration
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
