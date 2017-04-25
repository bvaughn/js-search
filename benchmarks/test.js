const Benchmark = require('benchmark');
const bb = require('beautify-benchmark');

function doThing({
  foo,
  bar,
  baz,
  qux
}) {
  return foo + bar + baz + qux;
}
function doThingAlt(foo, bar, baz, qux) {
  return foo + bar + baz + qux;
}

new Benchmark.Suite()
  .on('cycle', (event) => {
    bb.add(event.target);
  })
  .on('complete', () => {
    bb.log();
  })
  .add('recreate', () => {
    for (var i = 1000; i--;) {
      doThing({
//        foo: Math.random(),
//        bar: Math.random(),
//        baz: Math.random(),
        qux: Math.random()
      });
    }
  })
  .add('recycle', () => {
    var doThingParams = {
      foo: null,
      bar: null,
      baz: null,
      qux: null
    }
    for (var i = 1000; i--;) {
      doThingParams.foo = Math.random()
      doThingParams.bar = Math.random()
      doThingParams.baz = Math.random()
      doThingParams.qux = Math.random()
      doThing(doThingParams);
    }
  })
  .add('unnamed', () => {
    for (var i = 1000; i--;) {
      doThingAlt(Math.random(), Math.random(), Math.random(), Math.random());
    }
  })
  .run({ 'async': true });  