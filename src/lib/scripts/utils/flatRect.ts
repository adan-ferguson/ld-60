import type { Rectangle } from 'pixi.js'

export function flatRect(rect: Rectangle): [number, number, number, number] {
	return [rect.x, rect.y, rect.width, rect.height]
}
