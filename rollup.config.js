import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

const config = {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

export default config