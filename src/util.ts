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

export function createTimer(f: () => void, t: number) {
	let id: undefined | ReturnType<typeof setTimeout> = undefined

	const g = () => {
		id = undefined
		f()
	}

	const start = () => {
		stop()
		id = setTimeout(g, t)
	}

	const stop = () => {
		console.log(id, '!!!')
		if (id) clearTimeout(id)
		id = undefined
	}

	return [start, stop] as const
}
