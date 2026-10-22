import { writeFile } from 'node:fs/promises'
import { error } from '@sveltejs/kit'
import { LevelsManager } from '#lib/scripts/game/levelsManager.ts'

export async function POST({ request, params }) {
	const { id } = params
	if (!LevelsManager.isValidId(id)) {
		throw error(400, 'Invalid level ID')
	}
	const data = await request.json()
	const levelData = JSON.stringify(data, null, 2)
	const path = `./src/lib/scripts/game/levels/level${id}.ts`
	await writeFile(path, levelData + '\n', 'utf8')
	return Response.json(
		{
			status: 'success',
			message: 'Data saved successfully',
		},
		{ status: 200 },
	)
}
