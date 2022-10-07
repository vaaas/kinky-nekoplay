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

      window.addEventListener('keydown', this.on_key_down.bind(this))

      this.route('file_select')
      // this.route('watch')
   }

   set_file(x) {
      this.file = x
      if (this.file)
         this.route('watch', this.file)
      else
         this.route('file_select')
   }

   route(where, ...xs) {
      for (const [k, v] of Object.entries(this.routes)) {
         if (k === where) v.show(...xs)
         else v.hide()
      }
      return this
   }

   on_key_down(e) {
      if (e.key === 'Enter')
         this.routes.watch.focus_chat()
      else if (e.key === 'Escape')
         this.routes.watch.unfocus_chat()
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

      this.timeout = undefined
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
         h('video'),
         h('aside'),
      ])
      super(elem)

      this.video = new Player(elem.querySelector('video'))
         .on('play', this.req_play.bind(this))
         .on('pause', this.req_pause.bind(this))
      this.chat = new Chat(elem.querySelector('aside'))
         .on('play', (x) => this.video.play(x))
         .on('pause', () => this.video.pause())
   }

   show(blob) {
      super.show()
      this.video.set_blob(blob)
      this.chat.connect()
      return this
   }

   focus_chat() {
      this.chat.focus()
      return this
   }

   unfocus_chat() {
      this.chat.unfocus()
      return this
   }

   req_play(x) {
      this.chat.send_play(x)
   }

   req_pause() {
      this.chat.send_pause()
   }
}

class Player extends Elem {
   constructor(elem) {
      super(elem)
      elem.onclick = this.on_click.bind(this)
      this.blob = undefined
   }

   set_blob(x) {
      this.blob = x
      if (!this.blob) return this
      this.elem.src = URL.createObjectURL(this.blob)
      return this
   }

   on_click(e) {
      if (this.elem.paused)
         this.emit('play', this.elem.currentTime)
      else
         this.emit('pause')
   }

   play(x) {
      if (x !== undefined)
         this.elem.currentTime = x
      this.elem.play()
      return this
   }

   pause() {
      this.elem.pause()
      return this
   }
}

class Chat extends Elem {
   constructor(elem) {
      super(elem)
      this.log = h('div', { className: 'log' })
      this.log.onmousedown = this.begin_drag.bind(this)
      this.log.onmouseup = this.end_drag.bind(this)
      this.input = h('input')
      this.input.onchange = this.on_input_change.bind(this)
      elem.appendChild(this.log)
      elem.appendChild(this.input)
      elem.id = 'chat'
      this.ws = undefined

      this.start_timeout()
   }

   begin_drag() {
      this.clear_timeout()
      this.log.onmousemove = this.drag.bind(this)
   }

   end_drag() {
      this.log.onmousemove = null
      this.start_timeout()
   }

   drag(e) {
      this.elem.style.left = e.clientX - (this.elem.clientWidth/2) + 'px'
      this.elem.style.top = e.clientY - (this.elem.clientHeight/2) + 'px'
   }

   connect() {
      if (this.ws) return
      this.ws = new WebSocket(`wss://${location.hostname}:${location.port}/ws`)
      this.ws.onmessage = this.on_message.bind(this)
      this.send_name(prompt('Name?'))
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
            this.add_chat(data[1], data[2])
            break

         case 'notice':
            this.add_notice(data[1])
            break

         case 'play':
            this.emit('play', data[1])
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

   send_play(x) {
      this.ws.send(JSON.stringify(['play', x]))
      return this
   }

   send_name(x) {
      this.ws.send(JSON.stringify(['name', x]))
      return this
   }

   add_notice(x) {
      const elem = h('div', { className: 'msg notice' }, [x])
      this.log.appendChild(elem)
      this.elem.scrollIntoView()
      this.show()
      this.start_timeout()
      return this
   }

   add_chat(name, msg) {
      const elem = h('div', { className: 'msg chat' }, [
         h('span', { className: 'name' }, [name]),
         h('span', {}, [msg])
      ])
      this.log.appendChild(elem)
      elem.scrollIntoView()
      this.show()
      this.start_timeout()
      return this
   }

   hide() {
      if (document.activeElement !== this.input)
         this.elem.classList.add('opaque')
      return this
   }

   show() {
      this.elem.classList.remove('opaque')
      return this
   }

   clear_timeout() {
      if (this.timeout)
         clearTimeout(this.timeout)
      this.timeout = undefined
   }

   start_timeout() {
      this.clear_timeout()
      this.timeout = setTimeout(this.hide.bind(this), 3e3)
   }

   focus() {
      this.clear_timeout()
      this.show()
      this.input.focus()
      return this
   }

   unfocus() {
      this.input.blur()
      this.hide()
      return this
   }

   on_input_change() {
      this.send_chat(this.input.value)
      this.input.value = ''
      this.input.blur()
      this.start_timeout()
   }
}

window.onload = () => new App()
