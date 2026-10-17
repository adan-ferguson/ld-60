import { Container } from 'pixi.js'

type Options = {
	draw: (deltaMS: number) => void
	finished: () => void
	durationMS: number
}

export class VfxAnimation extends Container {
	timeMS = 0
	isFinished = false
	options: Options
	constructor(options: Partial<Options>) {
		super()
		this.options = {
			draw: () => {},
			finished: () => {},
			durationMS: 500,
			...options,
		}
	}
	update(deltaMS: number) {
		this.timeMS += Math.min(this.options.durationMS, deltaMS)
		this.options.draw(this.timeMS / this.options.durationMS)
		if (this.timeMS >= this.options.durationMS) {
			this.options.finished()
			this.isFinished = true
		}
	}
}
