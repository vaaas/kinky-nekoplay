import Modal from "../Modal"

type Props = {
	onClose: (x: MouseEvent|undefined) => void;
}

export default function Help({onClose}: Props) {
	return <Modal
		title='Instructions'
		close='My understanding grows'
		onClose={onClose}
	>
		<p>Select a local video file.</p>

		<p>Coordinate with your friends so that they also select the same video file.</p>

		<p>Click on the video to play and pause the video.</p>

		<p>When someone plays a video, it plays for every participant simultaneously. Likewise for pausing.</p>

		<p>Press <code>Enter</code> to focus the chat field.</p>

		<p>Press <code>Enter</code> to send your message.</p>

		<p>Press <code>Esc</code> to unfocus the chat field.</p>

		<p>Press <code>F2</code> to open the settings.</p>

		<p>Don't have too much fun. <code>:)</code></p>
	</Modal>
}
