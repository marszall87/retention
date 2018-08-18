import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';
import visualizer from 'rollup-plugin-visualizer';

const dev = process.env.BUILD !== 'production';

const defaultConfig = ({ minify }) => ({
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    postcss({
      modules: {
        generateScopedName: name => {
          return `retention-${name}`;
        }
      },
      extract: 'dist/retention.css'
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    minify && terser(),
    !minify && visualizer()
  ]
});

const umdAndEsmConfig = ({ minify }) => ({
  input: 'src/index.js',
  output: [
    {
      file: `dist/retention.umd${minify ? '.min' : ''}.js`,
      format: 'umd',
      name: 'Retention',
      sourcemap: true,
      globals: {
        c3: 'c3'
      }
    },
    {
      file: `dist/retention.esm${minify ? '.min' : ''}.js`,
      format: 'esm',
      sourcemap: true,
      globals: {
        c3: 'c3'
      }
    }
  ],
  ...defaultConfig({ minify })
});

const cjsConfig = ({ minify }) => ({
  input: 'src/index-cjs.js',
  output: {
    file: `dist/retention.cjs${minify ? '.min' : ''}.js`,
    format: 'cjs',
    sourcemap: minify,
    globals: {
      c3: 'c3'
    }
  },
  ...defaultConfig({ minify })
});

const config = dev
  ? umdAndEsmConfig({ minify: false })
  : [umdAndEsmConfig({ minify: false }), umdAndEsmConfig({ minify: true }), cjsConfig({ minify: false })];

export default config;
