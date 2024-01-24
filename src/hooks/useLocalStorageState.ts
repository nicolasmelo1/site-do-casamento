"use client";

import { useState, useEffect, useCallback } from "react";

export default function useLocalStorageState<TValue>(
  key: string,
  defaultValue?: TValue
) {
  const isWindowAndJSONAvailable =
    typeof window !== "undefined" && typeof JSON !== "undefined";

  const [state, setState] = useState<TValue>(() => {
    if (isWindowAndJSONAvailable) {
      const valueInLocalStorage = window.localStorage.getItem(key);

      const isValidValueInLocalStorage =
        [undefined, null, ""].includes(valueInLocalStorage) === false;
      console.log(
        "valueInLocalStorage",
        valueInLocalStorage,
        JSON.parse(valueInLocalStorage as string)
      );
      if (isValidValueInLocalStorage)
        return JSON.parse(valueInLocalStorage as string);
    }

    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  useEffect(() => {
    window?.localStorage?.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}
