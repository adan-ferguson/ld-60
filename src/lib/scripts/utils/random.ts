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
}
