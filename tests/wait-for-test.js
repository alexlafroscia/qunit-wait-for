const td = require("testdouble");
const installVerify = require("testdouble-qunit");
const { installWaitFor } = require("../pkg");
const { test } = QUnit;

installVerify(QUnit, td);
installWaitFor(QUnit);

test("it can wait for a condition to be successful", async function (assert) {
  const return2After2 = td.when(td.function()()).thenReturn(1, 2);
  const return2After3 = td.when(td.function()()).thenReturn(1, 1, 2);
  const callCounter = td.function();

  await assert.waitFor(() => {
    assert.equal(return2After2(), 2);
    assert.equal(return2After3(), 2);
    callCounter();
  });

  assert.verify(
    callCounter(),
    { times: 3 },
    "Took 3 calls to get everything to pass"
  );
});

test("it throws a non-timeout error", async function (assert) {
  assert.expect(1);

  const e = new Error("Some Error");
  const stub = td.when(td.function()()).thenThrow(e);

  try {
    await assert.waitFor(() => {
      assert.ok(stub());
    });
  } catch (error) {
    assert.equal(error, e);
  }
});

test("it can time out while waiting", async function (assert) {
  const stub = td.when(td.function()()).thenReturn(1);

  td.replace(assert, "pushResult");

  await assert.waitFor(() => {
    assert.equal(stub(), 2);
  });

  const {
    calls: [{ args }],
  } = td.explain(assert.pushResult);

  td.reset(); // Let `assert` work again

  assert.deepEqual(args, [
    { result: false, actual: 1, expected: 2, message: undefined },
  ]);
});

test("it can handle an async assertion callback", async function (assert) {
  const stub = td
    .when(td.function()())
    .thenReturn(Promise.resolve(1), Promise.resolve(2));

  await assert.waitFor(async () => {
    assert.equal(await stub(), 2);
  });
});

test("it does not disrupt other assertions from completing", async function (assert) {
  assert.expect(2);

  let result = false;
  setTimeout(function () {
    result = true;

    // An assertion outside `waitUntil` that is complete while `waitFor` is pending
    assert.ok(true);
  }, 10);

  await assert.waitFor(() => {
    assert.ok(result);
  });
});
