import { db as originalDb, sql as originalSql } from "./kysely";
import seed from "./seed";

function attachProxyToExecute(target: any) {
  return new Proxy(target, {
    get(target, prop) {
      console.log("getting prop", prop);
      const existingValue = (target as any)[prop];
      if (prop === "execute") {
        console.log("calling execute");
        return async (...args: any[]) => {
          console.log("calling seed");

          await seed();
          return (target as any)[prop](...args);
        };
      }

      if (typeof existingValue === "function") {
        const fn = (...args: any[]): any => {
          const result = (target as any)[prop](...args);
          return attachProxyToExecute(result);
        };
        return fn.bind(target);
      }

      return existingValue;
    },
  });
}

export const db = attachProxyToExecute(originalDb) as typeof originalDb;

export function sql(strings: TemplateStringsArray, ...args: any[]) {
  return attachProxyToExecute(originalSql(strings, ...args));
}
