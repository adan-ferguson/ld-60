import Game from '#lib/scripts/game/game.ts'
import { Turret } from '#lib/scripts/game/enemies/turret.ts'
import { Man } from '#lib/scripts/game/enemies/man.ts'
import type { TileDef } from '#lib/scripts/game/tileDef.ts'

export function tryCreateEnemy(game: Game, def: TileDef) {
	if (def.contents.kind === 'turret') {
		return new Turret(game, def.tileXY)
	} else if (def.contents.kind === 'man') {
		return new Man(game, def.tileXY, def.contents.behavior, def.contents.facing)
	}
	return false
}
