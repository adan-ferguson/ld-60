import { CoolAudio } from '#lib/scripts/audio/coolAudio.ts'

export class CoolChannel {
	sources = new Set<AudioBufferSourceNode>()
	gainNode = CoolAudio.getAudioContext().createGain()
	currentGeneration = 0
	constructor() {
		this.gainNode.connect(CoolAudio.getAudioContext().destination)
	}
	stop() {
		this.currentGeneration++
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
		return this.currentGeneration
	}
	isCurrent(generation: number) {
		return generation === this.currentGeneration
	}
}
