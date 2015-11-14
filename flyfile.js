const paths = {
  dist: 'dist/',
  source: 'source/**/*.ts',
  tests: 'tests/**/*.js'
}
const files = {
  main: 'js-search.js',
  minified: 'js-search.min.js'
}

export default function* () {
  yield this.start('build')
}

export function* build () {
  yield this.clear(paths.dist)

  yield this
    .source(paths.source)
    .ts({
      module: 'umd',
      preserveConstEnums: true,
      removeComments: true,
      sourceMap: true
    })
    .concat(files.main)
    .target(paths.dist)

  yield this
    .source(paths.dist + files.main, 'source/node-export.js')
    .concat(files.main)
    .target(paths.dist)

  yield this
    .source(paths.dist + files.main)
    .uglify()
    .concat(files.minified)
    .target(paths.dist)
}

export function* watchAndBuild () {
  yield this.watch(paths.source, 'build')
}