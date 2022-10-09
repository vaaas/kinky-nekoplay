import { Accessor, createSignal } from 'solid-js'
import Player from '../components/Player'
import Connection from '../Connection'
import Chat from '../components/Chat'
import type { Chat as ChatT, Notice } from '../types'
import { append } from '../util'

type Props = {
   file: Accessor<File>;
}

export default function Watch({ file }: Props) {
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

   return <section id='watch'>
      <Player file={file}
			paused={paused}
			onClick={videoClicked}
			time={time} />
      <Chat connection={connection} log={log}/>
   </section>
}
