import { browser } from '$app/env'

export type InputState = {
	moveX: number
	moveY: number
	button1: boolean
	button2: boolean
}

const keysDown = new Set<string>()

if (browser) {
	window.addEventListener('keydown', (e) => {
		if (document.activeElement instanceof HTMLInputElement) {
			return
		}
		const key = e.key.toLowerCase()
		keysDown.add(key)
	})
	window.addEventListener('keyup', (e) => {
		if (document.activeElement instanceof HTMLInputElement) {
			return
		}
		const key = e.key.toLowerCase()
		keysDown.delete(key)
	})
}

export function getInputState(): InputState {
	const gamepad = navigator.getGamepads().find(Boolean)
	const moveLeft = keysDown.has('a') || keysDown.has('arrowleft') || gamepad?.buttons[14]?.pressed
	const moveRight = keysDown.has('d') || keysDown.has('arrowright') || gamepad?.buttons[15]?.pressed
	const moveUp = keysDown.has('w') || keysDown.has('arrowup') || gamepad?.buttons[12]?.pressed
	const moveDown = keysDown.has('s') || keysDown.has('arrowdown') || gamepad?.buttons[13]?.pressed
	const button1 = keysDown.has('z') || keysDown.has('i') || gamepad?.buttons[0]?.pressed || false
	const button2 = keysDown.has('x') || keysDown.has('o') || gamepad?.buttons[1]?.pressed || false
	return {
		moveX: (moveRight ? 1 : 0) - (moveLeft ? 1 : 0),
		moveY: (moveDown ? 1 : 0) - (moveUp ? 1 : 0),
		button1,
		button2,
	}
}
