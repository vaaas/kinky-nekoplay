import { Accessor, createSignal } from "solid-js";
import Modal from "../Modal";

type Props = {
	initialName: Accessor<string>;
	onClose: (name: string) => void;
}

export default function Settings({initialName, onClose}: Props) {
	const [name, setName] = createSignal(initialName())

	const onNameChange = (e: Event) =>
		setName((e.target as HTMLInputElement).value)

	return <Modal
		title='Settings'
		close='This is how I like it'
		onClose={() => onClose(name())}
	>
		<label for='name'>Name</label>
		<input
			value={name()}
			onChange={onNameChange}
			name='name'/>
	</Modal>
}
