import CoolRect from '#lib/scripts/utils/coolRect.ts'
import type { XY } from '#lib/scripts/utils/XY.ts'
import { TileDef } from '#lib/scripts/game/tileDef.ts'
import { Consts } from '#lib/scripts/consts.ts'

const THICKNESS = 2

export const ThinFloor = {
	THICKNESS,
	toWorldRect(tileXY: XY, position: 'top' | 'bottom' = 'top'): CoolRect {
		return TileDef.toWorldRect(tileXY).getEdge(position, THICKNESS)
	},
	toRect(position: 'top' | 'bottom' = 'top'): CoolRect {
		return new CoolRect({
			x: 0,
			y: position === 'top' ? 0 : Consts.TILE_SIZE_PX - THICKNESS,
			width: Consts.TILE_SIZE_PX,
			height: THICKNESS,
		})
	},
}
