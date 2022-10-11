import { render } from 'solid-js/web'
import App from './App'

window.onload = () => render(
	() => <App/>,
	document.body
)
