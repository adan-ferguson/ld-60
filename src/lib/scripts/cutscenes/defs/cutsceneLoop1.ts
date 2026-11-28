import { Cutscene } from '#lib/scripts/cutscenes/cutscene.ts'
import { ManSprite } from '#lib/scripts/pixi/entities/manSprite.ts'
import { CoolCounter } from '#lib/scripts/utils/coolCounter.ts'
import { CutsceneActor } from '#lib/scripts/cutscenes/cutsceneActor.ts'
export function cutsceneLoop1() {
	const princess = createPrincessActor()
	const man = createManActor()
	const redMan = createRedManActor()
	const cutscene = new Cutscene()
	cutscene.timeline
		.addThreshold(0, () => {
			cutscene.addChild(princess, man)
		})
		.addThreshold(3, () => {
			// cutscene.addChild() TODO: explosion animation
			cutscene.removeChild(princess)
		})
		.addThreshold(3.1, () => {
			cutscene.addChild(redMan)
		})

	return cutscene
}

function createPrincessActor() {
	const sprite = new ManSprite()
	// TODO: Something like this
	// sprite.scale.set(-1, 1)
	// sprite.x = 50
	// sprite.y = 0
	// sprite.velocity = { x: -4, y: 0 }
	// sprite.setAnimation('walk')
	const container = new CutsceneActor()
	container.addChild(sprite)
	container.timeline.addThreshold(0, () => {}).addThreshold(0, () => {})
	return container
}

function createManActor() {
	const sprite = new ManSprite()
	const container = new CutsceneActor()
	container.addChild(sprite)
	container.timeline.addThreshold(0, () => {}).addThreshold(0, () => {})
	return container
}

function createRedManActor() {
	const sprite = new ManSprite()
	const container = new CutsceneActor()
	container.addChild(sprite)
	container.timeline.addThreshold(0, () => {}).addThreshold(0, () => {})
	return container
}
