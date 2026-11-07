import type CoolRect from '#lib/scripts/utils/coolRect.ts'
import { Cardinal } from '#lib/scripts/utils/cardinal.ts'
import type { MovementBlocker } from '#lib/scripts/game/collisions/worldCollision.ts'

const MIN_ADJACENT_OVERLAP = 0.5
const SQUEEZE_LEEWAY = 2.5

export function isSquished(entityBounds: CoolRect, solids: MovementBlocker[]): boolean {
	return check(true) || check(false)
	function check(isX: boolean): boolean {
		const positive = Cardinal.fromAxis(isX)
		const negative = Cardinal.fromAxisDelta(isX, false)
		const candidates = solids.filter((solid) => {
			const overlap = solid.rect.overlap(entityBounds)
			if (!overlap) {
				return false
			}
			const adjacentOverlap = isX ? overlap.height : overlap.width
			return adjacentOverlap >= MIN_ADJACENT_OVERLAP
		})
		const positiveSolids = candidates
			.filter((solid) => {
				if (solid.thinFloor && (isX || positive.axis !== 'y')) {
					return false
				}
				return overlapsOnAdjacentAxis(entityBounds, solid.rect, positive)
			})
			.filter((solid) => isOnSide(entityBounds, solid.rect, positive))
			.sort((a, b) => a.rect[positive.oppositeEdge] - b.rect[positive.oppositeEdge])
		const negativeSolids = candidates
			.filter((solid) => {
				// Thin floors cannot be ceilings.
				if (solid.thinFloor) {
					return false
				}
				return overlapsOnAdjacentAxis(entityBounds, solid.rect, negative)
			})
			.filter((solid) => isOnSide(entityBounds, solid.rect, negative))
			.sort((a, b) => b.rect[negative.oppositeEdge] - a.rect[negative.oppositeEdge])
		const positiveSolid = positiveSolids[0]
		const negativeSolid = negativeSolids[0]
		if (!positiveSolid || !negativeSolid) {
			return false
		}
		const gap =
			positiveSolid.rect[positive.oppositeEdge] - negativeSolid.rect[negative.oppositeEdge]
		if (gap < entityBounds[positive.size] - SQUEEZE_LEEWAY) {
			return true
		}
		return false
	}
	function isOnSide(entity: CoolRect, solid: CoolRect, direction: Cardinal): boolean {
		const entityMidpoint = entity.midpoint[direction.axis]
		const solidMidpoint = solid.midpoint[direction.axis]

		return direction.sign > 0 ? solidMidpoint >= entityMidpoint : solidMidpoint <= entityMidpoint
	}
	function overlapsOnAdjacentAxis(entity: CoolRect, solid: CoolRect, direction: Cardinal): boolean {
		return (
			entity[direction.adjacentEdgeLower] < solid[direction.adjacentEdgeUpper] &&
			entity[direction.adjacentEdgeUpper] > solid[direction.adjacentEdgeLower]
		)
	}
}
