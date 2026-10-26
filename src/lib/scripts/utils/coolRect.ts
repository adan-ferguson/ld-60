import { Rectangle } from 'pixi.js'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'

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
	pad(obj: { w: number; h: number }): CoolRect
	pad(param: number | { w: number; h: number }): CoolRect {
		if (typeof param === 'number') {
			return this.pad({ w: param, h: param })
		}
		return new CoolRect({
			x: this.x - param.w,
			y: this.y - param.h,
			width: this.width + param.w * 2,
			height: this.height + param.h * 2,
		})
	}
}

export default CoolRect
