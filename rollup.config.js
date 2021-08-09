import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from '@rollup/plugin-typescript'

const pkg = require('./package.json')

export default {
  input: `src/index.ts`,
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: false },
    { file: pkg.module, format: 'es', sourcemap: false },
  ],
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    commonjs(),
    resolve(),
    sourceMaps(),
  ],
}
