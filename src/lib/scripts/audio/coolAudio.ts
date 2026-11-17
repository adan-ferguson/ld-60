import { CoolChannel } from '#lib/scripts/audio/coolChannel.ts'

let audioContext: AudioContext | undefined

function getAudioContext() {
	return (audioContext ??= new AudioContext())
}

type ChannelName = 'song' | 'sfx'
const channels = new Map<ChannelName, CoolChannel>()

type PlayOptions = {
	loop?: boolean
	finished?: () => void
	duration?: number
	replace?: boolean
	volume?: number
	pan?: number
}

export type PlaybackHandle = {
	stop(): void
}

function getChannel(channelName: ChannelName) {
	if (!channels.has(channelName)) {
		channels.set(channelName, new CoolChannel())
	}
	return channels.get(channelName)!
}

export const CoolAudio = {
	async loadBuffer(url: string): Promise<AudioBuffer> {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Failed to load music: ${url}`)
		}

		return getAudioContext().decodeAudioData(await response.arrayBuffer())
	},
	play(
		buffers: AudioBuffer | AudioBuffer[],
		channelName: ChannelName,
		options: PlayOptions = {},
	): PlaybackHandle {
		const channel = getChannel(channelName)
		const generation = options.replace ? channel.nextPlayback() : channel.currentGeneration
		const ctx = getAudioContext()
		const sources = new Set<AudioBufferSourceNode>()
		let stopped = false

		const handle = {
			stop() {
				if (stopped) {
					return
				}
				stopped = true
				for (const source of sources) {
					source.stop()
					source.disconnect()
					channel.sources.delete(source)
				}
				sources.clear()
			},
		}

		ctx.resume().then(() => {
			if (stopped || !channel.isCurrent(generation)) {
				return
			}

			const playbackGain = ctx.createGain()
			playbackGain.gain.value = options.volume ?? 1

			const stereoPanner = ctx.createStereoPanner()
			stereoPanner.pan.value = Math.max(-1, Math.min(1, options.pan ?? 0))

			playbackGain.connect(stereoPanner)
			stereoPanner.connect(channel.gainNode)

			const startTime = ctx.currentTime + 0.01
			const stopTime = options.duration === undefined ? undefined : startTime + options.duration
			let nextStartTime = startTime
			const b = Array.isArray(buffers) ? buffers : [buffers]
			b.forEach((buffer, i) => {
				const isLast = i === b.length - 1
				const source = ctx.createBufferSource()
				source.buffer = buffer
				source.loop = isLast && !!options.loop
				source.connect(playbackGain)
				source.start(nextStartTime)
				sources.add(source)
				if (stopTime !== undefined) {
					source.stop(stopTime)
				}
				source.onended = () => {
					channel.sources.delete(source)
					if (isLast) {
						playbackGain.disconnect()
						if (channel.isCurrent(generation)) {
							options.finished?.()
						}
					}
				}
				nextStartTime += buffer.duration
				channel.sources.add(source)
			})
		})

		return handle
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
	getAudioContext,
}
