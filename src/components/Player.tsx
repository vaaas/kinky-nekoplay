import './Player.css'
import { Accessor, createEffect, Setter } from "solid-js"

type Props = {
   file: Accessor<File>;
   paused: Accessor<boolean>;
   onClick: (e: MouseEvent) => void;
	time: Accessor<number>;
}

export default function Player({ file, paused, onClick, time }: Props) {
   let ref: HTMLVideoElement

   const blob = () => URL.createObjectURL(file())

   createEffect(() => {
      if (paused())
         ref.pause()
      else
         ref.play()
   })

	createEffect(() => {
		ref.currentTime = time()
	})

   return <video ref={ref!} src={blob()} onClick={onClick}/>
}
