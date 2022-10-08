const clients = new Set()

const msg = (type, ...args) => JSON.stringify([type, ...args])

export default function on_connection(req, socket) {
	clients.add(socket)
	socket.name = 'anonymous'
	socket.on('message', (msg) => on_message(socket, msg))
	socket.on('close', () => clients.delete(socket))
	socket.on('error', () => clients.delete(socket))
	console.log(socket.name, 'connected')
	broadcast(msg('notice', `${socket.name} has joined`))
}

const message_map = {
	name: handle_name,
	chat: handle_chat,
	pause: handle_pause,
	play: handle_play,
}

function handle_name(ws, name) {
	let old = ws.name
	ws.name = name
	broadcast(msg('notice', `${old} is now known as ${ws.name}`))
}

function handle_chat(ws, message) {
	console.log(`${ws.name}: ${message}`)
	broadcast(msg('chat', ws.name, message))
}

function handle_pause(ws) {
	broadcast(msg('pause'))
	broadcast(msg('notice', `${ws.name} has paused playback`))
}

function handle_play(ws, time) {
	broadcast(msg('play', time))
	broadcast(msg('notice', `${ws.name} has resumed playback`))
}

const broadcast = x => { for (const c of clients) c.send(x) }

const try_json_parse = x => {
	try { return JSON.parse(x) }
	catch(e) { return undefined }
}

function on_message(ws, message) {
	const x = try_json_parse(message)
	if (!x)
		return ws.send(msg('notice', 'error parsing json'))
	else if (!(x[0] in message_map))
		return ws.send(msg('notice', 'unrecognised command: ' + x[0]))
	else
		message_map[x[0]](ws, ...x.slice(1))
}
