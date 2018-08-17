import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';
import visualizer from 'rollup-plugin-visualizer';

const dev = process.env.BUILD !== 'production';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/retention.js',
        format: 'umd',
        name: 'Retention',
        sourcemap: true,
        globals: {
            c3: 'c3'
        }
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    plugins: [
        postcss({
            modules: {
                generateScopedName: name => {
                    return `retention-${name}`;
                }
            },
            extract: true
        }),
        babel({
            runtimeHelpers: true,
            exclude: 'node_modules/**'
        }),
        resolve(),
        commonjs(),
        !dev && uglify(),
        visualizer()
    ]
};
