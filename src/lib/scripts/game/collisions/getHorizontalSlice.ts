import CoolRect from '#lib/scripts/utils/coolRect.ts'

export type HorizontalSliceSegment = {
	kind: 'solid' | 'gap'
	start: number
	end: number
	length: number
}

export function getHorizontalSlice(solids: CoolRect[], y: number, minX: number, maxX: number) {
	if (minX >= maxX) {
		return []
	}
	const intervals = solids
		.filter((solid) => solid.top <= y && y <= solid.bottom)
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
