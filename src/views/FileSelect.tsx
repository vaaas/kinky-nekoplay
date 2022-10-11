import './FileSelect.css'
import CyclingSpan from '../components/CyclingSpan'
import type { Setter } from 'solid-js'

type Props = {
	setFile: Setter<undefined|File>;
	onHelp: (e: MouseEvent) => void;
}

export default function FileSelect({ setFile, onHelp }: Props) {
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
			<p><a onClick={onHelp}>I don't understand and I need help</a></p>
		</section>
	)
}
