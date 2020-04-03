const QUnit = require("qunit");
const td = require("testdouble");
const installVerify = require("testdouble-qunit");
const { installWaitFor } = require("../pkg");
const { test } = QUnit;

installVerify(QUnit, td);
installWaitFor(QUnit);

test("it can wait for a condition to be successful", async function (assert) {
  const stub = td.when(td.function()()).thenReturn(1, 2);

  await assert.waitFor(() => {
    assert.equal(stub(), 2);
  });
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
