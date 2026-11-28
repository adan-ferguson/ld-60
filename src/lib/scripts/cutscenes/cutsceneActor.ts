import type { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'
import { Container } from 'pixi.js'

export class CutsceneActor extends Container {
	#timeline: CoolCounter
	constructor(timeline: CoolCounter) {
		super()
		this.#timeline = timeline
	}
	update(delta: number) {
		this.#timeline.value += delta
	}
}
