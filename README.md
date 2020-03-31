# `qunit-wait-for`

![Verify](https://github.com/alexlafroscia/qunit-wait-for/workflows/Verify/badge.svg)

> Wait for a QUnit Assertion

## Installation

Install the dependency:

```
yarn add -D qunit-wait-for
```

and then add the following in your JavaScript code:

```javascript
import QUnit from "qunit";
import { installWaitFor } from "qunit-wait-for";

installWaitFor(QUnit);
```

If you're using Ember, the right place for that snippet is your `tests/test-helper.js`.

## What does it do?

A common pattern in UI testing is the idea of needing to wait for some condition to be met before moving on in your tests. Normally we do some setup, interact with our application, wait for some event to take place, and then perform our assertions. For example, you might see something like this in an Ember integration test:

```javascript
await render(hbs`<MyComponent />`);

await click("[data-test-my-button]");
await settled(); // Or whatever your test framework provides

assert.dom("[data-test-my-result]").exists();
```

Many testing libraries provide helper functions to wait for your tests to catch up to the desired state:

- In Ember, there are many test helpers that serve this purpose; `waitUntil`, `settled`, and `await`-ing the promise returned from any other interactive test helpers all service this core purpose
- In React, the [async utilities from `@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/api-async) provide this functionality

However, needing to know when -- and how -- to correctly wait for the UI under test to reach the right state adds complexity to your tests and can couple them tightly to the underlying implementation of the components, if performed in a less-than-idea way.

There's another approach that you can take that's much cleaner; rather than waiting for your tests to reach some state and then asserting against it, you can just let your assertions run immediately... but be OK with it if they don't pass right away. You can try your assertion over and over again, if desired, until you get a passing assertion. I call this pattern "convergence testing", based on work from [The Frontside](https://frontside.io) on [BigTest.js](https://bigtestjs.io), where I first heard about this approach. The result is a test that both correctly waits for asynchronous operations to complete _and_ is decoupled from any specific logic around _how_ to wait for the right state.

## Usage

To use it, pass a callback to `assert.waitFor` and within in place your normal assertion:

```javascript
await assert.waitFor(() => {
  assert.dom("[data-test-my-element]").exists();
});
```

The resulting promise resolves when either the condition is met or the timeout is reached. This promise should always be `await`-ed so ensure one of those two things has happened before moving on.

## Prior Art

- [Converging on a Condition in QUnit](https://alexlafroscia.com/qunit-assert-converge-on/)
  A blog post I wrote a while ago, describing a similar API that was not based on using a normal assertion to test that the condition has been met
- [`waitFor` from `@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/api-async#waitfor)
  Inspired the API of this library, where you also pass a callback that performs an otherwise normal test assertion
