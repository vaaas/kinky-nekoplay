import './Aside.css'
import { children, createEffect, createSignal, JSXElement } from 'solid-js'
import { next_frame, sleep } from '../util';

type Props = {
	children: JSXElement | JSXElement[];
}

export function Aside(props: Props) {
	const c = children(() => props.children)
	const [hidden, setHidden] = createSignal(false)
	const [show, setShow] = createSignal(false)

	createEffect(async () => {
		if (c()) {
			setHidden(false)
			await next_frame()
			await next_frame()
			if (hidden() === false)
				setShow(true)
		} else {
			setShow(false)
			await sleep(250)
			if (show() ===  false)
				setHidden(true)
		}
	})

	return (
		<aside
			classList={{
				hidden: hidden(),
				show: show()
			}}
		>
			{c()}
		</aside>
	)
}
