import type { XY } from '#lib/scripts/utils/XY.ts'

export type CardinalDirection = 'up' | 'down' | 'left' | 'right'
export type Edge = 'top' | 'bottom' | 'left' | 'right'

const edgeMap = {
	up: 'top',
	down: 'bottom',
	left: 'left',
	right: 'right',
} as const

const oppositeMap = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left',
} as const

export class Cardinal {
	static fromAxis(isX: boolean) {
		return Cardinal.fromAxisDelta(isX, true)
	}
	static fromAxisDelta(isX: boolean, positive: boolean): Cardinal {
		if (isX) {
			return new Cardinal(positive ? 'right' : 'left')
		}
		return new Cardinal(positive ? 'down' : 'up')
	}
	constructor(private cardinalDirection: CardinalDirection) {}
	get adjacentEdgeUpper() {
		return this.isX ? 'bottom' : 'right'
	}
	get adjacentEdgeLower() {
		return this.isX ? 'top' : 'left'
	}
	get axis() {
		return this.isX ? 'x' : 'y'
	}
	get edge() {
		return edgeMap[this.cardinalDirection]
	}
	get size() {
		return this.isX ? 'width' : 'height'
	}
	get opposite() {
		return new Cardinal(this.oppositeDirection)
	}
	get oppositeDirection() {
		return oppositeMap[this.cardinalDirection]
	}
	get oppositeEdge() {
		return edgeMap[this.oppositeDirection]
	}
	get isX() {
		return this.cardinalDirection === 'left' || this.cardinalDirection === 'right'
	}
	get sign() {
		if (this.cardinalDirection === 'down' || this.cardinalDirection === 'right') {
			return 1
		}
		return -1
	}
	get xy(): XY {
		return {
			x: this.isX ? this.sign : 0,
			y: this.isX ? 0 : this.sign,
		}
	}
}
