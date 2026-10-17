export type XY = Readonly<{
	x: number
	y: number
}>

export const XY = {
	angleBetween(a: XY, b: XY): number {
		return Math.atan2(b.y - a.y, b.x - a.x)
	},
	diff(a: XY, b: XY): XY {
		return {
			x: a.x - b.x,
			y: a.y - b.y,
		}
	},
	distance(a: XY, b: XY): number {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
	},
	fromKey(key: string): XY {
		const [x, y] = key.split(',').map(Number)
		if (x === undefined || y === undefined) {
			throw new Error(`Could not parse XY from key: ${key}`)
		}
		return { x, y }
	},
	invert(xy: XY): XY {
		return XY.scale(xy, -1)
	},
	length(xy: XY): number {
		return Math.sqrt(Math.pow(xy.x, 2) + Math.pow(xy.y, 2))
	},
	midpoint(a: XY, b: XY): XY {
		return {
			x: (a.x + b.x) / 2,
			y: (a.y + b.y) / 2,
		}
	},
	round(a: XY) {
		return {
			x: Math.round(a.x),
			y: Math.round(a.y),
		}
	},
	same(a: XY, b: XY): boolean {
		return a.x === b.x && a.y === b.y
	},
	scale(xy: XY, scale: number): XY {
		return {
			x: xy.x * scale,
			y: xy.y * scale,
		}
	},
	sq(val: number): XY {
		return { x: val, y: val }
	},
	sum(...args: XY[]): XY {
		return {
			x: args.reduce((acc, xy) => acc + xy.x, 0),
			y: args.reduce((acc, xy) => acc + xy.y, 0),
		}
	},
	toKey(xy: XY): string {
		return `${xy.x},${xy.y}`
	},
	vector(angle: number, speed: number): XY {
		return {
			x: speed * Math.cos(angle),
			y: speed * Math.sin(angle),
		}
	},
}
