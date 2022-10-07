import { useEffect, useRef } from "react";

// Credits to dan abramov
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: () => void, delay: number): void {
  const savedCallback = useRef() as unknown as { current: () => void };

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);

      return (): void => clearInterval(id);
    }
  }, [delay]);
}
