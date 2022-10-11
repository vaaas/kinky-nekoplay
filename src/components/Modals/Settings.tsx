import { Accessor, createEffect, createSignal, onMount } from "solid-js";
import Modal from "../Modal";

type Props = {
	initialName: Accessor<string>;
	onClose: (name: string) => void;
}

export default function Settings({initialName, onClose}: Props) {
	let ref: HTMLInputElement

	const [name, setName] = createSignal(initialName())

	const onNameChange = (e: Event) =>
		setName((e.target as HTMLInputElement).value)

	const commitEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			setName(ref.value)
			onClose(name())
		}
	}

	onMount(() => {
		requestAnimationFrame(() => ref.focus())
	})

	return <Modal
		title='Settings'
		close='This is how I like it'
		onClose={() => onClose(name())}
	>
		<label for='name'>Name</label>
		<input
			ref={ref!}
			value={name()}
			onKeyDown={commitEnter}
			onChange={onNameChange}
			name='name'/>
	</Modal>
}
