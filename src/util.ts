export const sleep = (ms: number) => new Promise(done => setTimeout(done, ms))
export const next_frame = async () => new Promise(done => requestAnimationFrame(done))

export function append<T>(x: T, xs: Array<T>): Array<T> {
	xs.push(x)
	return xs
}
