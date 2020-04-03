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
// Start with some modal rendered
await render(hbs`<ModalDialog />`);

// Close the modal, which might need time to animate off-screen
await click("[data-test-close-button]");

// Wait for the modal to actually be gone
await waitUntil(() => findAll("[data-test-modal-element]").length === 0);

// Actually _assert_ that the modal is gone
assert.dom("[data-test-modal-element").doesNotExist();
```

Many testing libraries provide helper functions to wait for your tests to catch up to the desired state:

- In Ember, there are many test helpers that serve this purpose; `waitUntil`, `settled`, and `await`-ing the promise returned from other test helpers all serve this purpose
- In React, the [async utilities from `@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/api-async) provide this functionality

However, needing to know when -- and how -- to correctly wait for the UI under test to reach the right state adds complexity to your tests and can couple them tightly to the underlying implementation of the code being tested.

There's another approach that you can take that's much cleaner; rather than waiting for your tests to reach some state and then asserting against it, you can let your assertions run immediately and gracefully handle an initial failure. Then, try the assertion again, over and over until it passes (or a timeout is reached). I call this pattern "convergence testing" based on work from [The Frontside](https://frontside.io) on [BigTest.js](https://bigtestjs.io). The result is a test that both correctly waits for asynchronous operations to complete _and_ is decoupled from specific logic around _how_ to wait for the right state.

With `qunit-wait-for`, the example above can be simplified to this:

```javascript
await render(hbs`<ModalDialog />`);

await click("[data-test-close-button]");

await assert.waitFor(() => {
  assert.dom("[data-test-modal-element").doesNotExist();
});
```

## Usage

To use it, pass a callback to `assert.waitFor` and within it place your normal assertion:

```javascript
await assert.waitFor(() => {
  assert.dom("[data-test-my-element]").exists();
});
```

The resulting promise resolves when either the condition is met or the timeout is reached. This promise should always be `await`-ed so ensure one of those two things has happened before moving on.

You can also provide an override for the amount of time to wait for the assertion to pass, if needed. By default it will wait for up to 1000ms (1 second):

```javascript
// Wait for up to 2 seconds instead of 1
await assert.waitFor(
  () => {
    assert.dom("[data-test-my-element]").exists();
  },
  { timeout: 2000 }
);
```

## Prior Art

- [Converging on a Condition in QUnit](https://alexlafroscia.com/qunit-assert-converge-on/)

  A blog post I wrote a while ago, describing a similar API that was not based on using a normal assertion to test that the condition has been met

- [`waitFor` from `@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/api-async#waitfor)

  Inspired the API of this library, where you also pass a callback that performs an otherwise normal test assertion
