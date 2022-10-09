import './Notice.css'
import { Accessor } from "solid-js"
import { Notice as NoticeT } from "../types";

type Props = {
	id: Accessor<number>;
	msg: NoticeT;
}

export function Notice({ id, msg }: Props) {
	return <div id={ id().toString() } class='msg notice'>
		<span>{ msg.message }</span>
	</div>
}
