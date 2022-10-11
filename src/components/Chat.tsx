import './Chat.css'
import { Accessor } from 'solid-js'
import type Connection from '../Connection'
import type { Chat as ChatT, Notice } from '../types'
import Log from './Log';

type Props = {
	connection: Connection;
	log: Accessor<Array<ChatT|Notice>>;
}

export default function Chat({ connection, log }: Props) {
	function onInputChange(e: Event) {
		const target = e.target as HTMLInputElement
		connection.chat(target.value)
		target.value = ''
		target.blur()
		// start_timeout
	}

	return (
		<aside id='chat'>
			<Log log={log}/>
			<input onchange={onInputChange}/>
		</aside>
	)
}
