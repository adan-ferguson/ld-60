import type CoolRect from '#lib/scripts/utils/coolRect.ts'
import { Cardinal } from '#lib/scripts/utils/cardinal.ts'

export function isSquished(entityBounds: CoolRect, solids: CoolRect[]): boolean {
	const overlappingSolids = solids.filter((s) => s.overlap(entityBounds))
	return check(true) || check(false)
	function check(isX: boolean): boolean {
		const cardinal = Cardinal.fromAxis(isX)
		// TODO: here
	}
}
