const msg = (type: string, ...args: any[]) => JSON.stringify([type, ...args])

type Props = {
   onChat: (who: string, what: string) => void;
   onNotice: (x: string) => void;
   onPlay: (x: number) => void;
   onPause: () => void;
}

export default class Connection {
   socket: WebSocket;
   onChat: Props['onChat'];
   onNotice: Props['onNotice'];
   onPlay: Props['onPlay'];
   onPause: Props['onPause'];

   constructor({ onChat, onNotice, onPlay, onPause }: Props) {
      this.onChat = onChat
      this.onNotice = onNotice
      this.onPlay = onPlay
      this.onPause = onPause
      this.socket = new WebSocket('wss://kinky-nekoplay.paedosexual.tk')
      this.socket.onmessage = this.onMessage.bind(this)
   }

   chat(x: string) {
      this.socket.send(msg('chat', x))
   }

   pause() {
      this.socket.send(msg('pause'))
   }

   play(currentTime: number) {
      this.socket.send(msg('play', currentTime))
   }

   name(x: string) {
      this.socket.send(msg('name', x))
   }

   onMessage(message: any) {
      let x: any[]
      try {
         x = JSON.parse(message.data)
      } catch(e) {
         console.error(e)
         return
      }

      switch(x[0]) {
         case 'chat':
            return this.onChat(x[1]!, x[2]!)
         case 'notice':
            return this.onNotice(x[1]!)
         case 'play':
            return this.onPlay(x[1]!)
         case 'pause':
            return this.onPause()
         default:
            return console.error('Unknown message type:', x[0])
      }
   }
}
