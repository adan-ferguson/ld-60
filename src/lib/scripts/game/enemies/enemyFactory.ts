import Game from '#lib/scripts/game/game.ts'
import { Turret } from '#lib/scripts/game/enemies/turret.ts'
import { Man } from '#lib/scripts/game/enemies/man.ts'
import type { EnemyTileDef } from '#lib/scripts/game/tileDef.ts'

export function createEnemy(game: Game, def: EnemyTileDef) {
	if (def.contents.enemyKind === 'turret') {
		return new Turret(game, def.tileXY)
	} else if (def.contents.enemyKind === 'man') {
		return new Man(game, def.tileXY)
	}
	throw 'aaa'
}
