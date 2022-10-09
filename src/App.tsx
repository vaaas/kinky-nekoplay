import { Accessor, createEffect, createSignal } from 'solid-js'
import FileSelect from './FileSelect'
import Watch from './Watch'

export default function App() {
   const [route, setRoute] = createSignal('file-select')
   const [file, setFile] = createSignal<File|undefined>(undefined)

   createEffect(() => {
      if (file())
         setRoute('watch')
   })

   const component = () => {
      switch (route()) {
         case 'file-select':
            return <FileSelect setFile={setFile}/>
         case 'watch':
            return <Watch file={file as Accessor<File>}/>
         default:
            return 'route note found'
      }
   }

   return (<> {component()} </>)
}
