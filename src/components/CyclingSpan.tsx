import './CyclingSpan.css'
import { createSignal, onCleanup, onMount } from 'solid-js'
import { shuffle, sleep } from '../util'

const choices = shuffle([
	'bitch',
	'boomer',
	'bro',
	'buddy',
	'comrade',
	'faggot',
	'fella',
	'gurl',
	'homie',
	'motherfucker',
	'my dude',
	'nigga',
	'pal',
	'slut',
	'ya cunt',
	'zoomer',
])

export default function CyclingSpan() {
	const [at, setAt] = createSignal(0)
	const [opaque, setOpaque] = createSignal(false)

	const choice = () => choices[at()]

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

	return <span classList={{
		'cycling-span': true,
		'opaque': opaque(),
	}}>
		{choice()}
	</span>
}
