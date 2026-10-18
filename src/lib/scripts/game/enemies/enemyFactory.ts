import Game from '#lib/scripts/game/game.ts'
import type { EnemySpawnDef } from '#lib/scripts/game/enemies/enemy.ts'
import { Turret } from '#lib/scripts/game/enemies/turret.ts'
import { Man } from '#lib/scripts/game/enemies/man.ts'

export function createEnemy(game: Game, def: EnemySpawnDef) {
	if (def.enemyType === 'turret') {
		return new Turret(game, def.tileXY)
	} else if (def.enemyType === 'man') {
		return new Man(game, def.tileXY)
	}
	throw 'aaa'
}
