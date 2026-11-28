import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'
import { Container } from 'pixi.js'

export class CutsceneActor extends Container {
	timeline: CoolCounter
	constructor() {
		super()
		this.timeline = new CoolCounter()
	}
	update(delta: number) {
		this.timeline.value += delta
	}
}
