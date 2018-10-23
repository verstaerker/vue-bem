const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const filesize = require('rollup-plugin-filesize');

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
    filesize()
  ].concat(plugins || []),
});

builder([uglify()])
  .then((bundle) => {
    bundle.write({
      file: 'vue-bem-directive.umd.min.js',
      dir: 'dist',
      format: 'umd',
      exports: 'named',
      name: 'vueBemDirective',
      sourcemap: true,
    });
  });

builder()
  .then((bundle) => {
    bundle.write({
      file: 'vue-bem-directive.esm.js',
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
    });
  });

