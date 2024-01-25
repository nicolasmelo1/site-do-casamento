import { useCallback, useMemo, useState } from "react";
import cookiesBuilder from "../utils/cookies";

export default function useCookieStorageState<TValue>(
  cookies: string,
  key: string,
  defaultValue?: TValue
) {
  const cookie = useMemo(() => cookiesBuilder(cookies), [cookies]);
  const [state, _setState] = useState<TValue>(() => {
    if (cookie.has(key)) {
      const valueInCookies = cookie.get(key);

      const isValidValueInLocalStorage =
        valueInCookies?.value &&
        [undefined, null, ""].includes(valueInCookies.value) === false;

      if (isValidValueInLocalStorage)
        return JSON.parse(valueInCookies?.value as string);
    }

    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  const setState = useCallback(
    (value: TValue) => {
      _setState(value);
      cookie.set(key, JSON.stringify(value));
    },
    [_setState, key, cookie]
  );

  return [state, setState] as const;
}
