const sleep = ms => new Promise(done => setTimeout(done, ms))

function h(name, props, children) {
   const elem = document.createElement(name)
   if (props)
      for (const [k, v] of Object.entries(props))
         elem[k] = v
   if (children)
      for (const c of children)
         if (c instanceof Node)
            elem.appendChild(c)
         else
            elem.appendChild(document.createTextNode(c))
   return elem
}

class Elem {
   constructor(elem) {
      this.elem = elem
      this.events = {}
   }

   show() {
      this.elem.classList.remove('hidden')
      return this
   }

   hide() {
      this.elem.classList.add('hidden')
      return this
   }

   mount(parent) {
      parent.appendChild(this.elem)
      return this
   }

   on(event, f) {
      if (!(event in this.events))
         this.events[event] = []
      this.events[event].push(f)
      return this
   }

   emit(event, ...xs) {
      if (!(event in this.events))
         return this
      for (const f of this.events[event])
         f(...xs)
      return this
   }
}

class App extends Elem {
   constructor(elem = document.body) {
      super(elem)

      this.file = undefined

      this.routes = {
         file_select: new FileSelect()
            .mount(elem)
            .on('file', this.set_file.bind(this)),
         watch: new Watch()
            .mount(elem)
      }

      // this.route('file_select')
      this.route('watch')
   }

   set_file(x) {
      this.file = x
      if (this.file)
         this.route('watch', this.file)
      else
         this.route('file_select')
   }

   route(where, ...xs) {
      this.elem.className =
         where === 'watch'
         ? 'movie-time'
         : ''
      for (const [k, v] of Object.entries(this.routes)) {
         if (k === where) v.show(...xs)
         else v.hide()
      }
      return this
   }
}

class FileSelect extends Elem {
   constructor() {
      const elem = h('section', { id: 'fileselect' }, [
         h('h1', {}, [
            'select a file, ',
            h('span'),
         ]),
         h('input', {
            type: 'file'
         })
      ])

      super(elem)
      this.span = new CyclingSpan(this.elem.querySelector('span'))
      this.elem.querySelector('input').onchange = this.file_selected.bind(this)
   }

   hide() {
      super.hide()
      this.span.stop()
      return this
   }

   show() {
      super.show()
      this.span.start()
      return this
   }

   file_selected(e) {
      this.emit('file', e.target.files[0])
      return this
   }
}

class CyclingSpan extends Elem {
   constructor(elem) {
      super(elem)

      this.at = 0
      this.choices = [
         'my dude',
         'homie',
         'buddy',
         'nigga',
         'pal',
         'bro',
         'comrade',
         'slut',
      ]

      elem.classList.add('cycling-span')
      elem.innerText = this.choices[this.at]

      this.interval = undefined
   }

   stop() {
      clearInterval(this.interval)
      return this
   }

   start() {
      this.interval = setInterval(this.change.bind(this), 1500)
      return this
   }

   async change() {
      this.elem.classList.add('opaque')
      await sleep(250)
      this.elem.classList.remove('opaque')
      this.elem.innerText = this.next_choice()
      return this
   }

   next_choice() {
      this.at++
      if (this.at >= this.choices.length)
         this.at = 0
      return this.choices[this.at]
   }
}

class Watch extends Elem {
   constructor() {
      const elem = h('section', { id: 'watch' }, [
         h('video', { 'controls': true }),
         h('aside'),
      ])
      super(elem)

      this.video = new Player(elem.querySelector('video'))
      this.chat = new Chat(elem.querySelector('aside'))
   }

   show(blob) {
      super.show()
      this.video.set_blob(blob)
      this.chat.connect()
      return this
   }
}

class Player extends Elem {
   constructor(elem) {
      super(elem)
      this.blob = undefined
   }

   set_blob(x) {
      this.blob = x
      if (!this.blob) return this
      this.elem.src = URL.createObjectURL(this.blob)
   }
}

class Chat extends Elem {
   constructor(elem) {
      super(elem)
      this.log = h('div', { className: 'log' })
      this.input = h('input')
      elem.appendChild(this.log)
      elem.appendChild(this.input)
      elem.id = 'chat'
      this.ws = undefined
   }

   connect() {
      if (this.ws) return
      this.ws = new WebSocket(`ws://${location.hostname}:${location.port}/ws`)
      this.ws.onmessage = this.on_message.bind(this)
      setTimeout(() => this.send_chat('YOO!!!'), 250)
   }

   on_message(x) {
      let data
      try {
         data = JSON.parse(x.data)
      } catch(e) {
         console.error(e)
         return
      }
      switch(data[0]) {
         case 'chat':
            console.log(data)
            break

         case 'notice':
            this.add_notice(data[1])
            break

         case 'play':
            this.emit('play')
            break

         case 'pause':
            this.emit('pause')
            break

         default:
            console.error('Unknown message type:', data[0])
      }
      return this
   }

   send_chat(x) {
      this.ws.send(JSON.stringify(['chat', x]))
      return this
   }

   send_pause() {
      this.ws.send(JSON.stringify(['pause']))
      return this
   }

   send_play() {
      this.ws.send(JSON.stringify(['play']))
      return this
   }

   add_notice(x) {
      this.log.appendChild(
         h('p', { class: 'msg notice' }, x),
      )
      return this
   }
}

window.onload = () => new App()
