import { XY } from '#lib/scripts/utils/XY.ts'

export class XYMap<T> {
	#map = new Map<string, T>()
	static fromArray<T>(arr: T[], fn: (t: T) => XY): XYMap<T> {
		const map = new XYMap<T>()
		arr.forEach((t) => {
			map.set(fn(t), t)
		})
		return map
	}
	get entries(): [XY, T][] {
		return [...this.#map.entries()].map(([key, value]) => [XY.fromKey(key), value])
	}
	get size() {
		return this.#map.size
	}
	get keys(): XY[] {
		return [...this.#map.keys()].map(XY.fromKey)
	}
	get values(): T[] {
		return [...this.#map.values()]
	}
	clear() {
		this.#map.clear()
	}
	clone(): XYMap<T> {
		return this.deepClone((v) => v)
	}
	deepClone(valClone: (t: T) => T): XYMap<T> {
		const map = new XYMap<T>()
		this.entries.forEach(([xy, value]) => map.set(xy, valClone(value)))
		return map
	}
	delete(xy: XY) {
		this.#map.delete(XY.toKey(xy))
	}
	has(xy: XY) {
		return this.#map.has(XY.toKey(xy))
	}
	get(xy: XY): T | undefined {
		return this.#map.get(XY.toKey(xy))
	}
	getOrCreate(xy: XY, defaultVal: T) {
		const val = this.get(xy)
		if (val !== undefined) {
			return val
		}
		this.set(xy, defaultVal)
		return defaultVal
	}
	set(xy: XY, value: T) {
		this.#map.set(XY.toKey(xy), value)
	}
}
