import { SvelteSet } from 'svelte/reactivity'
import { XY } from '#lib/scripts/utils/XY.ts'

type FlyingTextDef = {
	text: string
	origin: XY
	velocity: XY
	startTime: number
	duration: number
	uuid: string
	color: string
}

type FlyingTextInstance = {
	def: FlyingTextDef
	currentPosition: XY
	t: number
}

type AddParams = {
	text: string
	origin: XY
	velocity?: XY
	duration?: number
	color?: string
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
				t: delta / def.duration,
			}
		})
	}
	addText(options: AddParams) {
		this.texts.add({
			uuid: crypto.randomUUID(),
			startTime: this.time,
			duration: options.duration ?? 1,
			origin: options.origin,
			text: options.text,
			velocity: options.velocity ?? { x: 0, y: -5 },
			color: options.color ?? 'white',
		})
	}
	addScore(amount: number, origin: XY) {
		this.addText({
			text: amount.toString(),
			origin,
			color: 'lime',
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
