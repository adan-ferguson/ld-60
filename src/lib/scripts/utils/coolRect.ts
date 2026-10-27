import { Rectangle } from 'pixi.js'

type Coords = {
	x?: number
	y?: number
	width?: number
	height?: number
}

class CoolRect {
	readonly x: number
	readonly y: number
	readonly width: number
	readonly height: number
	get area() {
		return this.width * this.height
	}
	constructor(args: Coords = {}) {
		this.x = args.x ?? 0
		this.y = args.y ?? 0
		this.width = args.width ?? 0
		this.height = args.height ?? 0
	}
	get left() {
		return this.x
	}
	get top() {
		return this.y
	}
	get right() {
		return this.x + this.width
	}
	get bottom() {
		return this.y + this.height
	}
	get midpoint() {
		return new CoolRect({
			x: this.x + this.width / 2,
			y: this.y + this.height / 2,
		})
	}
	asPixiRectangle() {
		return new Rectangle(...this.asXywh())
	}
	asXywh() {
		return [this.x, this.y, this.width, this.height] as const
	}
	intersects(rect: CoolRect, requireNonZeroArea = false) {
		const overlap = this.overlap(rect)
		if (!overlap) {
			return false
		}
		if (requireNonZeroArea) {
			return overlap.area > 0
		}
		return true
	}
	overlap(other: CoolRect): CoolRect | false {
		const left = Math.max(this.left, other.left)
		const right = Math.min(this.right, other.right)
		const top = Math.max(this.top, other.top)
		const bottom = Math.min(this.bottom, other.bottom)
		if (right >= left && bottom >= top) {
			return new CoolRect({
				x: left,
				y: top,
				width: right - left,
				height: bottom - top,
			})
		}
		return false
	}
	shift(param: { x: number; y: number }) {
		return new CoolRect({
			x: this.x + param.x,
			y: this.y + param.y,
			width: this.width,
			height: this.height,
		})
	}

	pad(num: number): CoolRect
	pad(obj: { x?: number; y?: number }): CoolRect
	pad(param: number | { x?: number; y?: number }): CoolRect {
		if (typeof param === 'number') {
			return this.pad({ x: param, y: param })
		}
		return new CoolRect({
			x: this.x - (param.x ?? 0),
			y: this.y - (param.y ?? 0),
			width: this.width + (param.x ?? 0) * 2,
			height: this.height + (param.y ?? 0) * 2,
		})
	}
}

export default CoolRect
