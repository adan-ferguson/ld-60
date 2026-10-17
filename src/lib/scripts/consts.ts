const x = 16
const y = 9
const multi = 2
const TILE_SIZE_PX = 8
const TILES_X = x * multi
const TILES_Y = y * multi

export const Consts = {
	TILE_SIZE_PX,
	TILES_X,
	TILES_Y,
	GAME_WIDTH: TILES_X * TILE_SIZE_PX,
	GAME_HEIGHT: TILES_Y * TILE_SIZE_PX,
}
