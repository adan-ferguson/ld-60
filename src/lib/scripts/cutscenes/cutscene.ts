import { Container } from 'pixi.js'
import { CoolEvents } from '#lib/scripts/utils/coolEvents.ts'
import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'

export type CutsceneId =
	'loop1' | 'loop2' | 'loop3_worst' | 'loop3_all_treasures' | 'loop3_no_continues' | 'loop3_best'

export class Cutscene extends Container<Container & { update: (delta: number) => void }> {
	events = CoolEvents.map({
		finished() {},
	})
	timeline = new CoolCounter()
	#finished = false
	finish() {
		if (this.#finished) {
			throw 'Cutscene already finished'
		}
		this.#finished = true
		this.events.finished.emit()
	}
	update(delta: number) {
		if (this.#finished) {
			return
		}
		for (const child of this.children) {
			child.update(delta)
		}
		this.timeline.value += delta
	}
}
