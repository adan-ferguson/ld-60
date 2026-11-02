export const Random = {
	chooseOne<T>(arr: T[]): T | undefined {
		if (arr.length <= 0) {
			return undefined
		}
		return arr[Random.int(arr.length)]!
	},
	int(exclusiveMax: number): number {
		const max = Math.floor(exclusiveMax)
		if (max !== exclusiveMax || max <= 0) {
			throw new Error('exclusiveMax must be a positive integer')
		}
		return Math.floor(Math.random() * exclusiveMax)
	},
	between(min: number, max: number): number {
		if (min > max) {
			throw new Error('min must be less than or equal to max')
		}
		return Math.random() * (max - min) + min
	},
}
