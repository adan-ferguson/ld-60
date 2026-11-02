import { Container } from 'pixi.js'

type Options = {
	duration: number
	update: (args: { t: number; delta: number; time: number }) => void
	finished: () => void
}

export class VfxAnimation {
	time = 0
	isFinished = false
	options: Options
	constructor(
		public pixiEl: Container,
		options: Partial<Options>,
	) {
		this.options = {
			update: () => {},
			finished: () => {},
			duration: 0.5,
			...options,
		}
	}
	update(delta: number) {
		if (this.isFinished) {
			return
		}
		this.time += Math.min(this.options.duration, delta)
		this.options.update({
			t: this.time / this.options.duration,
			time: this.time,
			delta: delta,
		})
		if (this.time >= this.options.duration) {
			this.options.finished()
			this.pixiEl.destroy()
			this.isFinished = true
		}
	}
}
