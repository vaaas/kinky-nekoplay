import type Connection from './Connection'

type Props = {
   connection: Connection
}
export default function Chat({ connection }: Props) {
   function onInputChange(e: Event) {
      const target = e.target as HTMLInputElement
      connection.chat(target.value)
      target.value = ''
      target.blur()
      // start_timeout
   }

   return (
      <aside id='chat'>
         <div class='log'/>
         <input onchange={onInputChange}/>
      </aside>
   )
}
