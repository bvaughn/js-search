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
node ./regression-test.js
```
