type EventMap = Record<string, (...args: any[]) => void>

type Handlers<T extends EventMap> = {
	[K in keyof T]: Handler<T[K]>
}

type Handler<T extends EventMap[string]> = {
	listen: (fn: T) => () => void
	emit: (...args: Parameters<T>) => void
	listeners: Set<T>
}

export const CoolEvents = {
	createHandler<T extends (...args: any[]) => void>(): Handler<T> {
		const listeners = new Set<T>()
		return {
			listeners,
			listen(fn) {
				listeners.add(fn)
				return () => {
					listeners.delete(fn)
				}
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
		 *   onChange: () => {},
		 *   onDestroy: () => {},
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
	 * Events.subscribe(events, {
	 *   onChange: () => {},
	 *   onDestroy: () => {},
	 * })
	 * as a shortcut for:
	 * events.onChange.listen(() => myListenerFunction)
	 * events.onDestroy.listen(() => myListenerFunction)
	 * @param events
	 * @param listeners
	 */
	subscribe<T extends EventMap>(events: Handlers<T>, listeners: Partial<{ [K in keyof T]: T[K] }>) {
		for (const key in listeners) {
			events[key].listen(listeners[key]!)
		}
	},
}
