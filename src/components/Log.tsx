import './Log.css'
import { Accessor, createEffect, For } from "solid-js"
import { Chat as ChatT, Notice as NoticeT } from "../types"
import { ChatMessage } from "./ChatMessage"
import { Notice } from "./Notice"

type Props = {
	log: Accessor<Array<ChatT|NoticeT>>;
}

export default function Log({ log }: Props) {
	let ref: HTMLDivElement

	createEffect(() => {
		if (log().length === 0) return
		else ref.lastElementChild?.scrollIntoView()
	})

	return <div ref={ref!} class='log'>
		<For each={ log() }>
			{ (msg, i) =>
				is_chat(msg)
					? <ChatMessage id={i} msg={msg}/>
					: <Notice id={i} msg={msg}/> }
		</For>
	</div>
}

const is_chat = (x: ChatT | NoticeT): x is ChatT => x.type === 'chat'
