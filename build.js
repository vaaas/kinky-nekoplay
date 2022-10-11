import { build } from 'esbuild'
import { solidPlugin } from 'esbuild-plugin-solid'
import * as process from 'node:process'
import { readFileSync, writeFile, writeFileSync } from 'node:fs'

const prod = process.env.NODE_ENV === 'production'

const appname = 'kinky-nekoplay'

function build_inline() {
	const html = readFileSync('public/index.html').toString('utf-8')
	const script = readFileSync(`public/${appname}.js`).toString('utf-8')
	const css = readFileSync(`public/${appname}.css`).toString('utf-8')

	const build = html
		.replace(
			`<link rel='stylesheet' href='${appname}.css'>`,
			() => `<style>${css}</style>`
		)
		.replace(
			`<script src='${appname}.js'></script>`,
			() => `<script>${script}</script>`
		)

	writeFileSync(`public/${appname}.html`, build)
}

build({
	entryPoints: ['src/index.tsx'],
	bundle: true,
	outfile: `public/${appname}.js`,
	minify: true,
	logLevel: 'info',
	plugins: [solidPlugin()],
	watch: !prod,
})
.then(() => {
	if (!prod) return
	build_inline()
})
.catch(() => process.exit(1));
