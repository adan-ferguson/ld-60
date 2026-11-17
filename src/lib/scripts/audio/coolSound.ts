import type { CoolChannel } from '#lib/scripts/audio/coolChannel.ts'
import type { PlayOptions } from '#lib/scripts/audio/coolAudio.ts'

export class CoolSound {
	private stopped = false
	private sources = new Set<AudioBufferSourceNode>()
	private playbackGain: GainNode
	private panner: StereoPannerNode
	private generation: number

	constructor(
		private ctx: AudioContext,
		private channel: CoolChannel,
		private buffers: AudioBuffer[],
		private options: PlayOptions,
	) {
		this.generation = options.replace ? channel.nextPlayback() : channel.currentGeneration

		this.playbackGain = ctx.createGain()
		this.playbackGain.gain.value = options.volume ?? 1

		this.panner = ctx.createStereoPanner()
		this.panner.pan.value = options.pan ?? 0

		this.playbackGain.connect(this.panner)
		this.panner.connect(channel.gainNode)
	}
	start() {
		if (this.stopped) {
			return
		}

		const startTime = this.ctx.currentTime + 0.01
		let nextStartTime = startTime
		const stopTime =
			this.options.duration === undefined ? undefined : startTime + this.options.duration

		for (const [index, buffer] of this.buffers.entries()) {
			const isLast = index === this.buffers.length - 1
			const source = this.ctx.createBufferSource()

			source.buffer = buffer
			source.loop = isLast && !!this.options.loop
			source.connect(this.playbackGain)
			source.start(nextStartTime)

			if (stopTime !== undefined) {
				source.stop(stopTime)
			}

			source.onended = () => {
				this.sources.delete(source)
				this.channel.sources.delete(source)

				if (isLast) {
					this.cleanup()

					if (!this.stopped && this.channel.isCurrent(this.generation)) {
						this.options.finished?.()
					}
				}
			}

			this.sources.add(source)
			this.channel.sources.add(source)
			nextStartTime += buffer.duration
		}
	}

	stop() {
		if (this.stopped) {
			return
		}

		this.stopped = true

		for (const source of this.sources) {
			source.stop()
			source.disconnect()
			this.channel.sources.delete(source)
		}

		this.sources.clear()
		this.cleanup()
	}

	private cleanup() {
		this.playbackGain.disconnect()
		this.panner.disconnect()
	}
}
