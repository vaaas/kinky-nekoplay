import './App.css'
import { Accessor, createEffect, createSignal } from 'solid-js'
import FileSelect from './views/FileSelect'
import Watch from './views/Watch'
import { Aside } from './components/Aside'
import Help from './components/Modals/Help'

export default function App() {
   const [route, setRoute] = createSignal('file-select')
   const [file, setFile] = createSignal<File|undefined>(undefined)
	const [help, setHelp] = createSignal(false)

   createEffect(() => {
      if (file())
         setRoute('watch')
   })

   const component = () => {
      switch (route()) {
         case 'file-select':
            return <FileSelect
					setFile={setFile}
					onHelp={() => setHelp(!help())}
				/>
         case 'watch':
            return <Watch file={file as Accessor<File>}/>
         default:
            return 'route note found'
      }
   }

   return <>
		<Aside>
			{ help()
				? <Help onClose={() => setHelp(false)} />
				: null }
		</Aside>

		<main>
			{component()}
		</main>
	</>
}
