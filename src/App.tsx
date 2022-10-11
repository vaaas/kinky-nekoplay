import './App.css'
import { Accessor, createEffect, createSignal } from 'solid-js'
import FileSelect from './views/FileSelect'
import Watch from './views/Watch'
import { Aside } from './components/Aside'
import Help from './components/Modals/Help'
import Settings from './components/Modals/Settings'

export default function App() {
	const [route, setRoute] = createSignal('file-select')
	const [file, setFile] = createSignal<File|undefined>(undefined)
	const [modal, setModal] = createSignal<string|undefined>(undefined)

	const [name, setName] = createSignal('anonymous')

	createEffect(() => {
		if (file())
			setRoute('watch')
	})

	const toggle_modal = (x: string) => () => {
		if (modal() === x) setModal(undefined)
		else setModal(x)
	}

	const component = () => {
		switch (route()) {
			case 'file-select':
				return <FileSelect
					setFile={setFile}
					onHelp={toggle_modal('help')} />
			case 'watch':
				return <Watch
					onSettings={toggle_modal('settings')}
					file={file as Accessor<File>}
					name={name}
				/>
			default:
				return 'route note found'
		}
	}

	const on_settings_close = (name: string) => {
		setName(name)
		setModal(undefined)
	}

	const modal_component = () => {
		switch (modal()) {
			case 'help':
				return <Help onClose={toggle_modal('help')} />
			case 'settings':
				return <Settings initialName={name} onClose={on_settings_close} />
			default:
				return null
		}
	}

	return <>
		<Aside>{modal_component()}</Aside>

		<main>
			{component()}
		</main>
	</>
}
