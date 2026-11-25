type EventMap = Record<string, (...args: any[]) => void>

type Handlers<T extends EventMap> = {
	[K in keyof T]: Handler<T[K]>
}

type Handler<T extends EventMap[string]> = {
	listen: (fn: (...args: Parameters<T>) => void) => () => void
	listenAsync: () => Promise<Parameters<T>[0]>
	emit: (...args: Parameters<T>) => void
	listeners: Set<(...args: Parameters<T>) => void>
}

export const CoolEvents = {
	createHandler<T extends (...args: any[]) => void>(): Handler<T> {
		const listeners = new Set<(...args: Parameters<T>) => void>()

		return {
			listeners,
			listen(fn) {
				listeners.add(fn)
				return () => {
					listeners.delete(fn)
				}
			},
			listenAsync() {
				return new Promise((resolve) => {
					const cleanup = this.listen((...args) => {
						cleanup()
						resolve(args[0])
					})
				})
			},
			emit(...args) {
				for (const fn of listeners) {
					fn(...args)
				}
			},
		}
	},
	map<T extends EventMap>(schema: T): Handlers<T> {
		/**
		 * Usage:
		 * const events = defineEvents({
		 *   onChange(){},
		 *   onDestroy(){},
		 * })
		 * events.onChange.emit()
		 * events.onChange.listen(() => myListenerFunction)
		 * @param schema
		 */
		const handlers: Partial<Handlers<T>> = {}
		for (const key in schema) {
			handlers[key] = CoolEvents.createHandler<T[typeof key]>()
		}
		return handlers as Handlers<T>
	},
	/**
	 * Usage:
	 * CoolEvents.subscribe(events, {
	 *   onChange(){
	 *     // do stuff
	 *   },
	 *   onDestroy(){
	 *     // do stuff
	 *   },
	 * })
	 * as a shortcut for:
	 * events.onChange.listen(() => myListenerFunction)
	 * events.onDestroy.listen(() => myListenerFunction)
	 * @param events
	 * @param listeners
	 */
	subscribe<T extends EventMap>(events: Handlers<T>, listeners: Partial<{ [K in keyof T]: T[K] }>) {
		const cleanups: (() => void)[] = []
		for (const key in listeners) {
			cleanups.push(events[key].listen(listeners[key]!))
		}
		return () => {
			for (const cleanup of cleanups) {
				cleanup()
			}
		}
	},
}
