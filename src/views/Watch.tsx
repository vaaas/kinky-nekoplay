import './Watch.css'
import { Accessor, createEffect, createSignal } from 'solid-js'
import Player from '../components/Player'
import Connection from '../Connection'
import Chat from '../components/Chat'
import type { Chat as ChatT, Notice } from '../types'
import { append } from '../util'

type Props = {
	file: Accessor<File>;
	onSettings: (x: MouseEvent) => void;
	name: Accessor<string>;
}

export default function Watch({ file, onSettings, name }: Props) {
	const connection = new Connection({
		onChat: (name, message) => {
			setLog(append({ type: 'chat', name, message }, log()))
		},

		onNotice: (message) => {
			setLog(append({ type: 'notice', message }, log()))
		},

		onPause: () => setPaused(true),

		onPlay: (now) => {
			setTime(now)
			setPaused(false)
		},
	})

	const [time, setTime] = createSignal(0)

	const [paused, setPaused] = createSignal(true)

	const [log, setLog] = createSignal<Array<ChatT|Notice>>([], {
		equals: false,
	})

	function videoClicked(e: MouseEvent) {
		if (paused())
			connection.play((e.target as HTMLVideoElement).currentTime)
		else
			connection.pause()
	}

	if (name() === 'anonymous')
		onSettings(undefined as any as MouseEvent)

	createEffect(() => {
		if (name() !== 'anonymous')
			connection.name(name())
	})

	return <section id='watch'>
		<div onClick={onSettings} class='settings-icon'>⚙️</div>
		<Player file={file}
			paused={paused}
			onClick={videoClicked}
			time={time} />
		<Chat connection={connection} log={log}/>
	</section>
}
