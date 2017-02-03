These benchmark tests measure real usage of js-search.
They enable simple performance comparisons between the latest released build and the local build.
To run a benchmark:

```bash
cd /path/to/js-search
yarn install

# Build local js-search (to incorporate any changes you've made)
npm run build

cd ./benchmarks
yarn install

# Run a benchmark of your choice
# eg Compare your local build of js-search to the latest released build
node ./regression-test.js
```

You can also compare two local builds of js-search:

```bash
# Assumes you've run `yarn install` in both directories prior

cd /path/to/js-search

# Make some changes and then build js-search
npm run build

# Move your build into the benchmarks folder as the 'latest'
cp -r ./dist ./benchmarks/node_modules/js-search/

# Make more changes and then re-build js-search
npm run build

# Compare your most recent build to the previous one
cd ./benchmarks
node ./regression-test.js
```