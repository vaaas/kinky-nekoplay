import CyclingSpan from './CyclingSpan'
import type { Accessor, Setter } from 'solid-js'

type Props = {
   setFile: Setter<undefined|File>;
}

export default function FileSelect({ setFile }: Props) {
   function handleOnChange(e: Event) {
      const files = (e.target as HTMLInputElement).files
      if (!files || files.length === 0)
         setFile(undefined)
      else
         setFile(files[0])
   }

   return (
      <section id='fileselect'>
         <h1>select a file, <CyclingSpan/></h1>
         <input type='file' accept='video/*' onchange={handleOnChange}/>
      </section>
   )
}
