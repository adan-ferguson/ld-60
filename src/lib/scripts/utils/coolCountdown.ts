export class CoolCountdown {
	#val: number
	#finished = false
	constructor(
		initialValue: number,
		private cb: () => void,
	) {
		this.#val = initialValue
	}
	get finished() {
		return this.#finished
	}
	countdown(delta: number) {
		if (this.#finished) {
			throw 'Countdown already finished, stop counting down!'
		}
		this.#val -= delta
		if (this.#val <= 0) {
			this.cb()
			this.#finished = true
		}
		return this
	}
}
