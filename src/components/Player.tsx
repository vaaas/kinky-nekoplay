import { Accessor, createEffect, Setter } from "solid-js"

type Props = {
   file: Accessor<File>;
   paused: Accessor<boolean>;
   onClick: (e: MouseEvent) => void;
}

export default function Player({ file, paused, onClick }: Props) {
   let ref: HTMLVideoElement

   const blob = () => URL.createObjectURL(file())

   createEffect(() => {
      if (paused())
         ref.pause()
      else
         ref.play()
   })

   return <video ref={ref!} src={blob()} onClick={onClick}/>
}
