# `qunit-wait-for`

> Wait for a QUnit Assertion

## Installation

Install the dependency

```
yarn add -D qunit-wait-for
```

and install the helper in your JavaScript code.

```javascript
import QUnit from "qunit";
import { installWaitFor } from "qunit-wait-for";

installWaitFor(QUnit);
```

If you're using Ember, the right place for that snippet is your `tests/test-helper.js`.

## Usage

`qunit-wait-for` allows you to wait for an assertion that might not pass _right now_ but will pass _soon_. The idea is that you write a test where your assertions converge on the desired state of your application, checking over and over again until the criteria are either met or a timeout is reached. This allows you to write tests that can be resilient to slight timing issues (which is common in UI testing) without needing to add explicit timeouts to your tests.

To use it, pass a callback to `assert.waitFor` and within in place your normal assertion:

```javascript
await assert.waitFor(() => {
  assert.dom("[data-test-my-element]").exists();
});
```

The resulting promise resolve when either the condition is met or the timeout is reached; this promise should be `await`-ed so ensure one of those two things has happened before moving on.

## Prior Art

- [Converging on a Condition in QUnit](https://alexlafroscia.com/qunit-assert-converge-on/)
  A blog post I wrote a while ago, describing a similar API that was not based on using a normal assertion to test that the condition has been met
- [`waitFor` from `@testing-library/dom`](https://testing-library.com/docs/dom-testing-library/api-async#waitfor)
  Inspired the API of this library, where you also pass a callback that performs an otherwise normal test assertion
