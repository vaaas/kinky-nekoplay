import { build } from 'esbuild'
import { solidPlugin } from 'esbuild-plugin-solid'
import * as process from 'node:process'

const prod = process.env.NODE_ENV === 'production'

build({
   entryPoints: ['src/index.tsx'],
   bundle: true,
   outfile: 'public/script2.js',
   minify: prod,
   logLevel: 'info',
   plugins: [solidPlugin()],
   watch: !prod,
 }).catch(() => process.exit(1));
