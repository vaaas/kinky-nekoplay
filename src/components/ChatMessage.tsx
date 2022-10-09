import { Accessor } from "solid-js"
import { Chat } from "../types";

type Props = {
	id: Accessor<number>;
	msg: Chat;
}

export function ChatMessage({ id, msg }: Props) {
	return <div id={id().toString()} class='msg chat'>
		<span class='name'>{ msg.name }</span>
		<span>{ msg.message }</span>
	</div>
}
