import './Modal.css'
import { Accessor, JSXElement, children as children_helper, onMount, onCleanup } from 'solid-js'

type Props = {
	title: string | Accessor<string>;
	children: JSXElement | JSXElement[];
	close?: undefined | string | Accessor<string>;
	onClose: (x: MouseEvent | undefined) => void;
}

export default function Modal({ title, children, close, onClose }: Props) {
	const c = children_helper(() => children)
	const compute_title = () =>
		typeof title === 'string'
			? title
			: title()

	const compute_close = () =>
		close === undefined
			? 'Close'
			: typeof close === 'string'
			? close
			: close()

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape')
			onClose(undefined)
	}

	onMount(() => {
		window.addEventListener('keydown', onKeyDown)
	})

	onCleanup(() => {
		window.removeEventListener('keydown', onKeyDown)
	})

	return <div class='modal'>
		<header>{compute_title()}</header>
		<div class='body'>
			{c()}
		</div>
		<footer>
			<button onClick={onClose}>
				{compute_close()}
			</button>
		</footer>
	</div>
}
