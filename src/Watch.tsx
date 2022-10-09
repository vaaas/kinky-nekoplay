import { Accessor, createSignal } from 'solid-js'
import Player from './Player'
import Connection from './Connection'
import Chat from './Chat';

type Props = {
   file: Accessor<File>;
}

export default function Watch({ file }: Props) {
   const connection = new Connection({
      onChat: () => {},
      onNotice: () => {},
      onPause: () => setPaused(true),
      onPlay: (now) => {
         setPaused(false)
      },
   })

   const [paused, setPaused] = createSignal(true)

   function videoClicked(e: MouseEvent) {
      if (paused())
         connection.play((e.target as HTMLVideoElement).currentTime)
      else
         connection.pause()
   }

   return <section id='watch'>
      <Player file={file} paused={paused} onClick={videoClicked}/>
      <Chat connection={connection}/>
   </section>
}
