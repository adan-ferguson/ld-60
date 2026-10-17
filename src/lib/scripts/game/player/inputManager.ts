import { browser } from '$app/env'

export type InputState = {
	moveX: number
	moveY: number
	button1: boolean
	button2: boolean
}

const keysDown = new Set<string>()
let gamepad: Gamepad | undefined

if (browser) {
	window.addEventListener('keydown', (e) => {
		if (document.activeElement instanceof HTMLInputElement) {
			return
		}
		keysDown.add(e.code)
		e.preventDefault()
	})
	window.addEventListener('keyup', (e) => {
		if (document.activeElement instanceof HTMLInputElement) {
			return
		}
		keysDown.delete(e.code)
		e.preventDefault()
	})
	gamepad = navigator.getGamepads().find(Boolean) ?? undefined
}

export function getInputState(): InputState {
	const stickX = digitalAxis(gamepad?.axes[0] ?? 0)
	const stickY = digitalAxis(gamepad?.axes[1] ?? 0)
	const moveLeft =
		keysDown.has('KeyA') ||
		keysDown.has('ArrowLeft') ||
		gamepad?.buttons[14]?.pressed ||
		stickX === -1
	const moveRight =
		keysDown.has('KeyD') ||
		keysDown.has('ArrowRight') ||
		gamepad?.buttons[15]?.pressed ||
		stickX === 1
	const moveUp =
		keysDown.has('KeyW') ||
		keysDown.has('ArrowUp') ||
		gamepad?.buttons[12]?.pressed ||
		stickY === -1
	const moveDown =
		keysDown.has('KeyS') ||
		keysDown.has('ArrowDown') ||
		gamepad?.buttons[13]?.pressed ||
		stickY === 1
	const button1 =
		keysDown.has('KeyZ') || keysDown.has('KeyI') || gamepad?.buttons[0]?.pressed || false
	const button2 =
		keysDown.has('KeyX') || keysDown.has('KeyO') || gamepad?.buttons[1]?.pressed || false
	return {
		moveX: (moveRight ? 1 : 0) - (moveLeft ? 1 : 0),
		moveY: (moveDown ? 1 : 0) - (moveUp ? 1 : 0),
		button1,
		button2,
	}
}

function digitalAxis(value: number, deadzone = 0.25): -1 | 0 | 1 {
	if (Math.abs(value) < deadzone) {
		return 0
	}
	return value < 0 ? -1 : 1
}
