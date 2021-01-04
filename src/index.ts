import { TimeoutError, waitUntil } from "./wait-until";

type AssertionCallback = () => Promise<void> | void;
type Options = {
  timeout: number;
};

interface Result {
  result: boolean;
}

export function doSOmething() {
  return `
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
  `;
}

export function installWaitFor(QUnit: QUnit) {
  Object.assign(QUnit.assert, {
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
