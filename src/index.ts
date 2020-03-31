import { TimeoutError, waitUntil } from "./wait-until";

type AssertionCallback = () => void;
type Options = {
  timeout: number;
};

interface Result {
  result: boolean;
}

export function installWaitFor(QUnit: QUnit) {
  QUnit.extend(QUnit.assert, {
    async waitFor(
      assertionCallback: AssertionCallback,
      { timeout = 1000 }: Options = { timeout: undefined }
    ) {
      const originalPushResult = this.pushResult;
      let lastResult: Result;

      this.pushResult = (result: Result) => {
        lastResult = result;
      };

      try {
        await waitUntil(() => {
          assertionCallback();

          return lastResult.result;
        }, timeout);
      } catch (e) {
        if (!(e instanceof TimeoutError)) {
          throw e;
        }
      } finally {
        this.pushResult = originalPushResult;
      }

      this.pushResult(lastResult);
    },
  });
}

declare global {
  interface Assert {
    waitFor(
      callback: AssertionCallback,
      options?: Options
    ): () => Promise<void>;
  }
}
