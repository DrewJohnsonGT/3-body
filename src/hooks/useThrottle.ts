import { useCallback, useEffect, useRef } from 'react';

/**
 * useThrottle hook
 *
 * @param callback - The function to be throttled.
 * @param delay - The minimum time in milliseconds between invocations.
 * @returns A function that, when called, will execute the callback at most once per specified delay.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const lastCall = useRef<number>(0);
  const savedCallback = useRef<T>(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall.current > delay) {
        lastCall.current = now;
        savedCallback.current(...args);
      }
    },
    [delay],
  );
};
