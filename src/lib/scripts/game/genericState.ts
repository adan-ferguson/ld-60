export abstract class GenericState<TOwner> {
	protected time = 0
	update(owner: TOwner, delta: number): void {
		this.update2(owner, delta)
		this.time += delta
	}
	protected abstract update2(owner: TOwner, delta: number): void
}
