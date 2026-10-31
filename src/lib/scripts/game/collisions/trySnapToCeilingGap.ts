import CoolRect from '#lib/scripts/utils/coolRect.ts'
import type { GameEntity } from '#lib/scripts/game/gameEntity.ts'

export type HorizontalSliceSegment = {
	kind: 'solid' | 'gap'
	start: number
	end: number
	length: number
}

export function trySnapToCeilingGap(entity: GameEntity, snapDist: number): boolean {
	const bounds = entity.worldBounds
	const y = bounds.top
	const minX = bounds.left - snapDist - bounds.width
	const maxX = bounds.right + snapDist + bounds.width
	const slice = getHorizontalSlice(
		entity.game.worldCollision.movementBlockers.map((b) => b.rect),
		y,
		minX,
		maxX,
	)
	const gaps = slice.filter((s) => s.kind === 'gap' && s.length >= bounds.width)
	if (!gaps.length) {
		return false
	}
	for (const gap of gaps) {
		const startDiff = gap.start - bounds.left
		if (startDiff > 0 && startDiff <= snapDist) {
			entity.left = gap.start
			return true
		}
		const endDiff = bounds.right - gap.end
		if (endDiff > 0 && endDiff <= snapDist) {
			entity.right = gap.end
			return true
		}
	}
	return false
}

function getHorizontalSlice(solids: CoolRect[], y: number, minX: number, maxX: number) {
	if (minX >= maxX) {
		return []
	}
	const intervals = solids
		.filter((solid) => solid.top < y && y <= solid.bottom)
		.map((solid) => ({
			start: Math.max(solid.left, minX),
			end: Math.min(solid.right, maxX),
		}))
		.filter(({ start, end }) => start < end)
		.sort((a, b) => a.start - b.start)

	const merged: { start: number; end: number }[] = []

	for (const interval of intervals) {
		const previous = merged.at(-1)
		if (previous && previous.end >= interval.start) {
			previous.end = Math.max(previous.end, interval.end)
		} else {
			merged.push({ ...interval })
		}
	}

	const result: HorizontalSliceSegment[] = []
	let cursor = minX
	for (const solid of merged) {
		if (cursor < solid.start) {
			result.push({
				kind: 'gap',
				start: cursor,
				end: solid.start,
				length: solid.start - cursor,
			})
		}
		result.push({
			kind: 'solid',
			start: solid.start,
			end: solid.end,
			length: solid.end - solid.start,
		})
		cursor = solid.end
	}
	if (cursor < maxX) {
		result.push({
			kind: 'gap',
			start: cursor,
			end: maxX,
			length: maxX - cursor,
		})
	}
	return result
}
