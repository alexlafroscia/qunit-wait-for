const futureTick = setTimeout;

const TIMEOUTS = [0, 1, 2, 5, 7];
const MAX_TIMEOUT = 10;

export function waitUntil(callback: () => unknown, timeout: number) {
  const waitUntilTimeoutError = new TimeoutError(
    "Condition not met within timeout"
  );

  return new Promise((resolve, reject) => {
    let time = 0;

    // eslint-disable-next-line require-jsdoc
    function scheduleCheck(timeoutsIndex: number) {
      let interval = TIMEOUTS[timeoutsIndex];
      if (interval === undefined) {
        interval = MAX_TIMEOUT;
      }

      futureTick(async function () {
        time += interval;

        let value: unknown;

        try {
          value = await callback();
        } catch (error) {
          reject(error);
        }

        if (value) {
          resolve();
        } else if (time < timeout) {
          scheduleCheck(timeoutsIndex + 1);
        } else {
          reject(waitUntilTimeoutError);
        }
      }, interval);
    }

    scheduleCheck(0);
  });
}

export class TimeoutError extends Error {}
