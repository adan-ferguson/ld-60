import { Container } from 'pixi.js'

type Options = {
	draw: (t: number) => void
	finished: () => void
	duration: number
}

export class VfxAnimation {
	timeMS = 0
	isFinished = false
	options: Options
	constructor(
		public pixiEl: Container,
		options: Partial<Options>,
	) {
		this.options = {
			draw: () => {},
			finished: () => {},
			duration: 0.5,
			...options,
		}
	}
	update(delta: number) {
		if (this.isFinished) {
			return
		}
		this.timeMS += Math.min(this.options.duration, delta)
		this.options.draw(this.timeMS / this.options.duration)
		if (this.timeMS >= this.options.duration) {
			this.options.finished()
			this.pixiEl.destroy()
			this.isFinished = true
		}
	}
}
