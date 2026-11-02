export class Intervaler {
	val: number = 0
	constructor(
		private callback: () => void,
		private interval: number,
	) {}
	add(delta: number) {
		this.set(this.val + delta)
	}
	set(val: number) {
		if (val > this.val) {
			const intervals = intervalsCrossed(this.interval, this.val, val)
			for (let i = 0; i < intervals; i++) {
				this.callback()
			}
		}
		this.val = val
	}
}

function intervalsCrossed(interval: number, before: number, after: number) {
	const beforeIntervals = Math.floor(before / interval)
	const afterIntervals = Math.floor(after / interval)
	return afterIntervals - beforeIntervals
}
