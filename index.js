'use strict'
import * as http from 'node:http'
import * as fs from 'node:fs'
import determine_mime_type from './lib/mime.js'
import make_websocket_server from './lib/websocket.js'

/** load the configuration */
async function load_conf() {
   let file = './conf.example.js'
   try {
      if (fs.existsSync('./conf.js'))
         file = './conf.js'
   } catch(e) {}
   console.log('!!!', file)

   return import(file).then(x => x.default)
}

/** serve a static file */
function request_listener(req, socket) {
   const file = 'public/' + (
      req.url === '/'
      ? 'index.xhtml'
      : req.url.slice(1)
   )
   try {
      const blob = fs.readFileSync(file)
      socket.writeHead(200, {
         'Content-Type': determine_mime_type(file)
      })
      socket.end(blob)
   } catch(e) {
      console.log(e.message)
      socket.writeHead(404, {
         'Content-Type': 'text/plain',
      })
      socket.end('Not found')
   }
}

/** handle upgrade request for websocket */
function upgrade_wss(req, socket, head, wss) {
   wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req))
}

/** main function */
async function main() {
   const conf = await load_conf()
   const wss = make_websocket_server()
   const http_server = http.createServer(request_listener)
   http_server
      .listen(conf.port, conf.host, () => console.log(`Server listening at ${conf.host}:${conf.port}`))
      .on('upgrade', (req, socket, head) => upgrade_wss(req, socket, head, wss))
}

main()
