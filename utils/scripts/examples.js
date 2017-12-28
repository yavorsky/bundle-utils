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
    code: `(class extends AnotherClass {
  constructor(args) {
    super(args);
  }
})
`,
    count: 300,
    filename: 'class.js',
  },
  {
    code: `[a, b] = g()
`,
    count: 300,
    filename: 'destructuring.js',
  },
  {
    code: `for (const i of []) {
  const a = 1;
}`,
    count: 300,
    filename: 'for-of.js',
  },
  {
    code: `function* x () {
  yield* fn();
    yield* fn();
    yield* fn();
}`,
    count: 300,
    filename: 'generator.js',
  },
  {
    code: `Promise.resolve();
[].includes;
"".includes;
new Map;
new Set;
Symbol();
Array.from;
Reflect.construct();
`,
    count: 1,
    filename: 'polyfills.js',
  },
  {
    code: "`a${b}c${d}${e}`;\n\n",
    count: 300,
    filename: 'tagged.js',
  },
];
