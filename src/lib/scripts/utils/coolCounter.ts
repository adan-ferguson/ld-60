export class CoolCounter {
	#value = 0
	#intervals = new Set<{ interval: number; cb: () => void }>()
	#thresholds = new Set<{ threshold: number; cb: () => void }>()

	addInterval(interval: number, cb: () => void) {
		this.#intervals.add({ interval, cb })
		return this
	}

	addThreshold(threshold: number, cb: () => void) {
		this.#thresholds.add({ threshold, cb })
		return this
	}

	get value() {
		return this.#value
	}

	set value(val: number) {
		for (const { interval, cb } of this.#intervals.values()) {
			const crossed = Math.abs(intervalsCrossed(interval, this.#value, val))

			for (let i = 0; i < crossed; i++) {
				cb()
			}
		}

		for (const threshold of this.#thresholds.values()) {
			if (this.#value < threshold.threshold && val >= threshold.threshold) {
				threshold.cb()
				this.#thresholds.delete(threshold)
			}
		}

		this.#value = val
	}

	setImmediately(val: number) {
		this.#value = val
		return this
	}
}

function intervalsCrossed(interval: number, before: number, after: number) {
	const beforeIntervals = Math.floor(before / interval)
	const afterIntervals = Math.floor(after / interval)
	return afterIntervals - beforeIntervals
}
