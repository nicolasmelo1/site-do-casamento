"use client";
import { useState, useEffect } from "react";

export default function useLocalStorageState<TValue>(
  key: string,
  defaultValue?: TValue
) {
  const [state, setState] = useState<TValue>(() => {
    if (typeof window === "undefined" || typeof JSON === "undefined")
      return typeof defaultValue === "function" ? defaultValue() : defaultValue;

    const valueInLocalStorage = window.localStorage.getItem(key);
    const isValidValueInLocalStorage =
      [undefined, null, ""].includes(valueInLocalStorage) === false;
    if (isValidValueInLocalStorage)
      return JSON.parse(valueInLocalStorage as string);
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  useEffect(() => {
    window?.localStorage?.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
