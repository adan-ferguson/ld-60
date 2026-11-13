let audioContext: AudioContext | undefined

function getAudioContext() {
	return (audioContext ??= new AudioContext())
}

type ChannelName = 'song' | 'ditty'
const channels = new Map<ChannelName, Channel>()

type PlayOptions = {
	loop?: boolean
	channelName?: ChannelName
	finished?: () => void
}

class Channel {
	sources: AudioBufferSourceNode[] = []
	gainNode = getAudioContext().createGain()
	stop() {
		for (const source of this.sources) {
			source.stop()
			source.disconnect()
		}
		this.sources = []
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
	play(coolAudio: AudioBuffer | AudioBuffer[], options: PlayOptions = {}) {
		const channel = options.channelName ? getChannel(options.channelName) : undefined
		if (channel) {
			channel.stop()
		}
		const ctx = getAudioContext()
		ctx.resume().then(() => {
			let startTime = ctx.currentTime + 0.05
			const buffers = Array.isArray(coolAudio) ? coolAudio : [coolAudio]
			buffers.forEach((buffer, i) => {
				const isLast = i === buffers.length - 1
				const source = ctx.createBufferSource()
				source.buffer = buffer
				source.loop = isLast && !!options.loop
				source.connect(channel?.gainNode ?? ctx.destination)
				source.start(startTime)
				if (isLast && options.finished) {
					source.onended = options.finished
				}
				startTime += buffer.duration
				channel?.sources.push(source)
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
