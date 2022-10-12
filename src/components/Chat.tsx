import './Chat.css'
import { Accessor, createSignal } from 'solid-js'
import type Connection from '../Connection'
import type { Chat as ChatT, Notice } from '../types'
import Log from './Log';

type Props = {
	connection: Connection;
	log: Accessor<Array<ChatT|Notice>>;
}

export default function Chat({ connection, log }: Props) {
	let ref: HTMLDivElement;

	const [ left, setLeft ] = createSignal(16);
	const [ top, setTop ] = createSignal(window.innerHeight - 250);

	function onInputChange(e: Event) {
		const target = e.target as HTMLInputElement
		connection.chat(target.value)
		target.value = ''
		target.blur()
	}

	const beginDrag = (e: MouseEvent) => {
		ref.addEventListener('mousemove', drag)
	}

	const endDrag = (e: MouseEvent) => {
		ref.removeEventListener('mousemove', drag)
	}

	const drag = (e: MouseEvent) => {
		setLeft(left() + e.movementX)
		setTop(top() + e.movementY)
	}

	return (
		<aside
			ref={ref!}
			id='chat'
			style={{
				left: left() + 'px',
				top: top() + 'px',
			}}
			onMouseDown={beginDrag}
			onMouseUp={endDrag}
		>
			<Log log={log}/>
			<input onchange={onInputChange}/>
		</aside>
	)
}
