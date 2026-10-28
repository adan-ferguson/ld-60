import type CoolRect from '#lib/scripts/utils/coolRect.ts'
import { Cardinal } from '#lib/scripts/utils/cardinal.ts'

const MIN_ADJACENT_OVERLAP = 0.5
const SQUEEZE_LEEWAY = 1

export function isSquished(entityBounds: CoolRect, solids: CoolRect[]): boolean {
	return check(true) || check(false)
	function check(isX: boolean): boolean {
		const positive = Cardinal.fromAxis(isX)
		const negative = Cardinal.fromAxisDelta(isX, false)
		const candidates = solids.filter((solid) => {
			const overlap = solid.overlap(entityBounds)
			if (!overlap) {
				return false
			}
			const adjacentOverlap = isX ? overlap.height : overlap.width
			return adjacentOverlap >= MIN_ADJACENT_OVERLAP
		})
		const positiveSolids = candidates
			.filter((solid) => overlapsOnAdjacentAxis(entityBounds, solid, positive))
			.filter((solid) => isOnSide(entityBounds, solid, positive))
			.sort((a, b) => a[positive.oppositeEdge] - b[positive.oppositeEdge])
		const negativeSolids = candidates
			.filter((solid) => overlapsOnAdjacentAxis(entityBounds, solid, negative))
			.filter((solid) => isOnSide(entityBounds, solid, negative))
			.sort((a, b) => b[negative.oppositeEdge] - a[negative.oppositeEdge])
		const positiveSolid = positiveSolids[0]
		const negativeSolid = negativeSolids[0]
		if (!positiveSolid || !negativeSolid) {
			return false
		}
		const gap = positiveSolid[positive.oppositeEdge] - negativeSolid[negative.oppositeEdge]
		if (gap < entityBounds[positive.size] - SQUEEZE_LEEWAY) {
			console.log(
				positiveSolid,
				negativeSolid,
				entityBounds,
				gap,
				entityBounds[positive.size] - SQUEEZE_LEEWAY,
			)
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
