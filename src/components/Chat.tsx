import './Chat.css'
import { Accessor, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import type Connection from '../Connection'
import type { Chat as ChatT, Notice } from '../types'
import Log from './Log';
import { createTimer } from '../util';

type Props = {
	connection: Connection;
	log: Accessor<Array<ChatT|Notice>>;
}

export default function Chat({ connection, log }: Props) {
	let input: HTMLInputElement

	const [ left, setLeft ] = createSignal(16)
	const [ top, setTop ] = createSignal(window.innerHeight - 250)
	const [ opaque, setOpaque ] = createSignal(false)
	const hide = () => setOpaque(true)
	const show = () => setOpaque(false)
	const [ start, stop ] = createTimer(hide, 3000)

	let timer = undefined as undefined | number

	function onInputChange(e: Event) {
		const target = e.target as HTMLInputElement
		connection.chat(target.value)
		target.value = ''
		target.blur()
		start()
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape')
			hide()
	}

	const beginDrag = (e: MouseEvent) => {
		(e.target as HTMLInputElement).addEventListener('mousemove', drag)
	}

	const endDrag = (e: MouseEvent) => {
		(e.target as HTMLInputElement).removeEventListener('mousemove', drag)
	}

	const drag = (e: MouseEvent) => {
		setLeft(left() + e.movementX)
		setTop(top() + e.movementY)
	}

	createEffect(() => {
		log()
		show()
		start()
	})

	const focus = () => input.focus()

	const onFocus = () => {
		show()
		stop()
	}

	const globalOnKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && document.activeElement && !['INPUT', 'BUTTON'].includes(document.activeElement.tagName)) {
			focus()
			e.stopPropagation()
			e.preventDefault()
		}
	}

	onMount(() => {
		document.addEventListener('keydown', globalOnKeydown)
	})

	onCleanup(() => {
		document.removeEventListener('keydown', globalOnKeydown)
	})

	return (
		<aside
			id='chat'
			classList={{
				opaque: opaque()
			}}
			style={{
				left: left() + 'px',
				top: top() + 'px',
			}}
			onMouseDown={beginDrag}
			onMouseUp={endDrag}
			onMouseOver={focus}
			onFocusIn={onFocus}
		>
			<Log log={log}/>
			<input
				ref={input!}
				onchange={onInputChange}
				onKeyDown={onKeyDown}
			/>
		</aside>
	)
}
