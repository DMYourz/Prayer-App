import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => unknown;

/**
 * usePersistFn 可以替代 useCallback 以降低心智负担
 */
export function usePersistFn<T extends AnyFn>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T | null>(null);
  if (!persistFn.current) {
    persistFn.current = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return persistFn.current as T;
}
