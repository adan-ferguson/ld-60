import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'

export function load({ params }) {
	return LevelsManager.get(params.id)
}
