import './CyclingSpan.css'
import { createSignal, onCleanup, onMount } from 'solid-js'
import { shuffle, sleep } from '../util'

const choices = shuffle([
	'my dude',
	'homie',
	'buddy',
	'nigga',
	'pal',
	'bro',
	'comrade',
	'slut',
])

export default function CyclingSpan() {
	const [at, setAt] = createSignal(0)
	const [opaque, setOpaque] = createSignal(false)

	const choice = () => choices[at()]
	const cls = () => [ 'cycling-span', (opaque() ? 'opaque' : '') ].join(' ')

	let interval: undefined|number = undefined

	onMount(() => {
		interval = setInterval(async () => {
			setOpaque(true)
			await sleep(250)
			let x = at() + 1
			if (x >= choices.length) x = 0
			setAt(x)
			setOpaque(false)
		}, 1500)
	})

	onCleanup(() => {
		if (interval)
			clearInterval(interval)
		interval = undefined
	})

	return <span class={cls()}>{choice()}</span>
}
