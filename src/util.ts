export const sleep = (ms: number) => new Promise(done => setTimeout(done, ms))

export function append<T>(x: T, xs: Array<T>): Array<T> {
	xs.push(x)
	return xs
}
