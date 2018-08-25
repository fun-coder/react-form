import typescript from 'rollup-plugin-typescript2';

import uglify from 'rollup-plugin-uglify';

export default {
  input: './index.ts',
  output: {
    file: 'index.bundle.js',
    format: 'cjs'
  },
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
    uglify(),
  ],
};