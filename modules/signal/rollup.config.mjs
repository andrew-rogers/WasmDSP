export default {
	input: 'signal.mjs',
  external: ['mathjs'],
	output: {
		file: '../../dist/modules/signal.js',
		format: 'umd',
    globals: {
      mathjs: 'mathjs'
    },
    name: 'WasmDSP.modules.signal'
  }
};
