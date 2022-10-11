export const sleep = (ms: number) => new Promise(done => setTimeout(done, ms))
export const next_frame = async () => new Promise(done => requestAnimationFrame(done))

export function append<T>(x: T, xs: Array<T>): Array<T> {
	xs.push(x)
	return xs
}

export function shuffle<T>(xs: Array<T>): Array<T> {
	for (let i = xs.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = xs[i] as T
		xs[i] = xs[j] as T
		xs[j] = temp
	}
	return xs
}
