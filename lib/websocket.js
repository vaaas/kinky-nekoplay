import { WebSocketServer } from 'ws'

function msg(type, ...args) {
   return JSON.stringify([type, ...args])
}

export default function make_websocket_server() {
   function on_ws_connection(ws) {
      ws.name = 'anonymous'
      ws.on('message', (msg) => on_message(ws, msg))
      console.log(ws.name, 'connected')
      broadcast(msg('notice', `${ws.name} has joined`))
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

   function broadcast(x) {
      for (const c of wss.clients)
         c.send(x)
   }

   function on_message(ws, message) {
      let x = null
      try { x = JSON.parse(message) }
      catch(e) {
         ws.send(msg('notice', 'error parsing json'))
         return
      }

      if (!(x[0] in message_map))
         ws.send(msg('notice', 'unrecognised command: ' + x[0]))
      else
         message_map[x[0]](ws, ...x.slice(1))
   }

   const wss = new WebSocketServer({ noServer: true })
      .on('connection', on_ws_connection)
   return wss
}
