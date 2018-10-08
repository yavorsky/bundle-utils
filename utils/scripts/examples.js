module.exports = [
  {
    code: `(async x => {
    await 1;
  });
`,
    count: 300,
    filename: 'async.js',
  },
  {
    code: `(class extends class {} {
  constructor(args) {
    super(args);
  }
});
`,
    count: 300,
    filename: 'class.js',
  },
  {
    code: `var [a, b] = new Set
`,
    count: 300,
    filename: 'destructuring.js',
  },
  {
    code: `for (const i of new Set) {}
`,
    count: 300,
    filename: 'for-of.js',
  },
  {
    code: `(function* x () {
  yield* fn();
  yield* fn();
  yield* fn();
})()
`,
    count: 300,
    filename: 'generator.js',
  },
//   {
//     code: `(async function* x () {
//   yield* fn();
//   await fn();
//   yield* fn();
//   yield* fn();
// })()
// `,
//     count: 300,
//     filename: 'async-generator.js',
//   },
  {
    code: `Promise.resolve();
[].includes;
"".includes;
new Map;
new Set;
Symbol();
Array.from;
Reflect.construct(class {}, []);
`,
    count: 1,
    filename: 'polyfills.js',
  },
  {
    code: '`a${1}c${2}${3}`;\n\n', // eslint-disable-line
    count: 300,
    filename: 'tagged.js',
  },
];
