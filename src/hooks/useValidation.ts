import { useMemo } from "react";
import { validationBuilder } from "../utils";
import { useCookieStorageState } from ".";

export default function useValidation<
  const TValuesToValidate extends {
    [key in Parameters<typeof validationBuilder>[0][number]]?: string;
  }
>(cookies: string, values: TValuesToValidate, triedToSubmitKey: string) {
  const [hasTriedToSubmit, setHasTriedToSubmit] = useCookieStorageState(
    cookies,
    triedToSubmitKey,
    false
  );

  const dependencyArray = Object.values(values);
  const validationObject = useMemo(() => {
    return validationBuilder(
      Object.keys(
        values
      ) as (keyof Required<TValuesToValidate>)[] extends Parameters<
        typeof validationBuilder
      >[0]
        ? (keyof Required<TValuesToValidate>)[]
        : never
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validationData = useMemo(() => {
    const validation = {
      isValidToSubmit: validationObject["isValidToSubmit"],
    } as {
      [key in keyof Required<TValuesToValidate>]?: string;
    } & {
      isValidToSubmit: () => boolean;
    };
    for (const [key, value] of Object.entries(values))
      (validation as any)[key] = (validationObject as any)[key](value);
    return validation;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencyArray, hasTriedToSubmit]);

  return {
    setHasTriedToSubmit,
    hasTriedToSubmit,
    validation: validationData,
  };
}
