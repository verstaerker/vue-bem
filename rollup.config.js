const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const filesize = require('rollup-plugin-filesize');
const replace = require('rollup-plugin-replace');

/**
 * Creates a rollup builder instance.
 *
 * @param {Array} plugins - Additional rollup plugins
 *
 * @returns {Promise<RollupSingleFileBuild>}
 */
const builder = plugins => rollup.rollup({
  input: 'src/index.js',
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    replace({
      'exclude': 'node_modules/**',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    filesize()
  ].concat(plugins || []),
});

builder([uglify()])
  .then((bundle) => {
    bundle.write({
      file: 'vue-bem.umd.min.js',
      dir: 'dist',
      format: 'umd',
      exports: 'named',
      name: 'vueBem',
      sourcemap: false,
    });
  });

builder()
  .then((bundle) => {
    bundle.write({
      file: 'vue-bem.esm.js',
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
    });
  });

