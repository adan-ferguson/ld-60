import { error } from '@sveltejs/kit'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'

export function load({ params }) {
	const id = params.id
	if (!LevelsManager.isValidId(id)) {
		throw error(400, 'The level ID must be an integer from 1 to 10')
	}
	return { wave: id }
}
