import { CoolChannel } from '#lib/scripts/audio/coolChannel.ts'
import { CoolSound } from '#lib/scripts/audio/coolSound.ts'

let audioContext: AudioContext | undefined

function getAudioContext() {
	return (audioContext ??= new AudioContext())
}

type ChannelName = 'song' | 'sfx'
const channels = new Map<ChannelName, CoolChannel>()

export type PlayOptions = {
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
	): CoolSound {
		const channel = getChannel(channelName)
		const ctx = getAudioContext()
		const sound = new CoolSound(ctx, channel, Array.isArray(buffers) ? buffers : [buffers], options)
		void sound.start()
		return sound
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
