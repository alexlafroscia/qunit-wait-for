import { TimeoutError, waitUntil } from "./wait-until";

type AssertionCallback = () => Promise<void> | void;
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
      let originalPushResult = this.pushResult;
      let lastResults: Result[];

      try {
        await waitUntil(async () => {
          // Reset to capture the most recent round of results
          lastResults = [];

          // Stub out `pushResult` as late as possible
          originalPushResult = this.pushResult;
          this.pushResult = (result: Result) => {
            lastResults.push(result);
          };

          try {
            await assertionCallback();
          } finally {
            // Restore original `pushResult` implementation right after callback
            this.pushResult = originalPushResult;
          }

          // `waitUntil` only "passes" if _all_ assertions were successful
          return lastResults.every(({ result }) => result);
        }, timeout);
      } catch (e) {
        if (!(e instanceof TimeoutError)) {
          throw e;
        }
      }

      for (const result of lastResults) {
        this.pushResult(result);
      }
    },
  });
}

declare global {
  interface Assert {
    waitFor(callback: AssertionCallback, options?: Options): Promise<void>;
  }
}
