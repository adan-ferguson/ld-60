import { dev } from '$app/env'
import { error } from '@sveltejs/kit'

export const handle = async ({ event, resolve }) => {
	if (!dev && event.url.pathname.startsWith('/editor')) {
		throw error(404, 'Not Found')
	}
	return resolve(event)
}
