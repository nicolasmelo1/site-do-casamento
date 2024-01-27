const savedCookies = new Map<
  string,
  {
    expires?: Date;
    maxAge?: number;
    value: string;
    samesite?: "strict" | "lax" | "none";
    secure?: boolean;
    path?: string;
  }
>();

/**
 * Gets the cookie from anywhere, either on the server or the client. It is set to run on the client by default though since it uses the `document` API.
 * But you can pass the initial data from anywhere. I think it's a better approach than setting the cookies directly on the server. Seems a lot better.
 *
 * @param cookiesString - The cookies string to parse. It can be the `document.cookie` or the `req.headers.cookie` or anything else.
 */
export default function cookies(cookiesString: string) {
  function parseCookie() {
    const cookiesToParse = cookiesString;
    const cookiesToParseArray = cookiesToParse.split("; ");
    let currentCookie = undefined;
    while (cookiesToParseArray.length > 0) {
      const currentCookieData = cookiesToParseArray.shift() as string;
      const isExpires =
        currentCookieData.startsWith("expires") ||
        currentCookieData.startsWith("Expires");
      const isMaxAge =
        currentCookieData.startsWith("max-age") ||
        currentCookieData.startsWith("Max-Age");
      const isSameSite =
        currentCookieData.startsWith("samesite") ||
        currentCookieData.startsWith("SameSite");
      const isSecure =
        currentCookieData.startsWith("secure") ||
        currentCookieData.startsWith("Secure");
      const isPath =
        currentCookieData.startsWith("path") ||
        currentCookieData.startsWith("Path");
      const currentSavedCookieData = currentCookie
        ? savedCookies.get(currentCookie)
        : {};

      if (isExpires) {
        const [, expires] = currentCookieData.split("=");
        if (currentCookie && expires)
          savedCookies.set(currentCookie, {
            ...currentSavedCookieData,
            expires: new Date(expires),
          } as any);
        continue;
      }
      if (isMaxAge) {
        const [, maxAge] = currentCookieData.split("=");
        if (currentCookie && maxAge)
          savedCookies.set(currentCookie, {
            ...currentSavedCookieData,
            maxAge: parseInt(maxAge),
          } as any);
        continue;
      }
      if (isSameSite) {
        const [, samesite] = currentCookieData.split("=");
        if (currentCookie && samesite)
          savedCookies.set(currentCookie, {
            ...currentSavedCookieData,
            samesite: samesite as any,
          } as any);
        continue;
      }
      if (isSecure) {
        if (currentCookie)
          savedCookies.set(currentCookie, {
            ...currentSavedCookieData,
            secure: true,
          } as any);
        continue;
      }
      if (isPath) {
        const [, path] = currentCookieData.split("=");
        if (currentCookie && path)
          savedCookies.set(currentCookie, {
            ...currentSavedCookieData,
            path,
          } as any);
        continue;
      }

      const [cookieKey, cookieValue] = currentCookieData.split("=");
      currentCookie = cookieKey;
      savedCookies.set(cookieKey, { value: cookieValue });
      continue;
    }
  }

  function* toString(keyToRemove?: string) {
    for (const [key, value] of Array.from(savedCookies.entries())) {
      yield `${key}=${value.value}${
        value.expires || key === keyToRemove
          ? `; expires=${
              key === keyToRemove
                ? `Thu, 01 Jan 1970 00:00:00 GMT`
                : value.expires
            }`
          : ""
      }${value.maxAge ? `; max-age=${value.maxAge}` : ""}${
        value.secure ? `; secure` : ""
      }${value.path ? `; path=${value.path}` : ""}${
        value.samesite ? `; samesite=${value.samesite}` : ""
      };`;
    }
  }

  function setCookieOnClient(keyToDelete?: string) {
    if (typeof document === "undefined") return;
    for (const cookie of Array.from(toString(keyToDelete))) {
      document.cookie = cookie;
    }
  }

  parseCookie();

  return {
    get(key: string) {
      const savedCookie = savedCookies.get(key);
      if (!savedCookie) return;
      const decoded = structuredClone(savedCookie);
      decoded.value = decodeURIComponent(decoded.value);
      return decoded;
    },
    set(
      key: string,
      value: string,
      options: Omit<Parameters<typeof savedCookies.set>[1], "value"> = {}
    ) {
      const encoded = encodeURIComponent(value);
      const existingCookie = savedCookies.get(key);
      if (existingCookie) {
        existingCookie.value = encoded;
        for (const [optionKey, optionValue] of Object.entries(options))
          (existingCookie as any)[optionKey] = optionValue;
      } else savedCookies.set(key, { ...options, value: encoded });
      setCookieOnClient();
    },
    has(key: string) {
      return savedCookies.has(key);
    },
    delete(key: string) {
      savedCookies.delete(key);
      setCookieOnClient(key);
    },
    toString,
  };
}
