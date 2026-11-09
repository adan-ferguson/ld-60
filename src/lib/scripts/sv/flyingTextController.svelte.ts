import { SvelteSet } from 'svelte/reactivity'
import { XY } from '#lib/scripts/utils/XY.ts'

type FlyingTextDef = {
	text: string
	origin: XY
	velocity: XY
	startTime: number
	duration: number
	uuid: string
}

type FlyingTextInstance = {
	def: FlyingTextDef
	currentPosition: XY
}

export class FlyingTextController {
	texts = new SvelteSet<FlyingTextDef>()
	time = $state(0)
	get instances(): FlyingTextInstance[] {
		const time = this.time
		return [...this.texts].map((def) => {
			const delta = time - def.startTime
			return {
				def,
				currentPosition: XY.sum(def.origin, XY.scale(def.velocity, delta)),
			}
		})
	}
	addScore(amount: number, origin: { x: number; y: number }) {
		this.texts.add({
			uuid: crypto.randomUUID(),
			text: amount.toString(),
			origin,
			startTime: this.time,
			duration: 111,
			velocity: { x: 0, y: -1 },
		})
	}
	update(delta: number) {
		this.time += delta
		for (const text of this.texts.values()) {
			if (this.time - text.startTime > text.duration) {
				this.texts.delete(text)
			}
		}
	}
}
