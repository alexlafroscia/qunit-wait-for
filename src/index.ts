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
      let lastResults: Result[];

      this.pushResult = (result: Result) => {
        lastResults.push(result);
      };

      try {
        await waitUntil(() => {
          // Reset to capture the most recent round of results
          lastResults = [];

          assertionCallback();

          // `waitUntil` only "passes" if _all_ assertions were successful
          return lastResults.every(({ result }) => result);
        }, timeout);
      } catch (e) {
        if (!(e instanceof TimeoutError)) {
          throw e;
        }
      } finally {
        this.pushResult = originalPushResult;
      }

      for (const result of lastResults) {
        this.pushResult(result);
      }
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
