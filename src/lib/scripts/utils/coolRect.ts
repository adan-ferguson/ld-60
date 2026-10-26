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
	constructor(args: Coords = {}) {
		this.x = args.x ?? 0
		this.y = args.y ?? 0
		this.width = args.width ?? 0
		this.height = args.height ?? 0
	}
	get r() {
		return this.x + this.width
	}
	get b() {
		return this.y + this.height
	}
	asPixiRectangle() {
		return new Rectangle(...this.asXywh())
	}
	asXywh() {
		return [this.x, this.y, this.width, this.height] as const
	}
	intersects(rect: CoolRect) {
		// Lazy LOL
		return this.asPixiRectangle().intersects(rect.asPixiRectangle())
	}

	static fromTileXY(tileXY: XY) {
		return new CoolRect(TileDef.toWorldRect(tileXY))
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
