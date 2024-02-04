import { strings } from "../constants";
import { isValidCNPJ, isValidCPF } from "./cpf-cnpj";

function nameValidation(value: string) {
  const nameExistValidation = typeof value === "string" && value.length > 0;
  const fullNameValidation = nameExistValidation
    ? value.split(" ").length > 1 &&
      value.split(" ").every((value) => value !== "")
    : true;

  return nameExistValidation === false
    ? strings.nameValidationNonExistingError
    : fullNameValidation === false
    ? strings.nameValidationFullNameError
    : undefined;
}

function cpfCnpjValidation(value: string) {
  const cleanedCpfCnpj =
    typeof value === "string" ? value.replace(/[\.\-\/]/g, "") : "";
  const cpfCnpjExistValidation = typeof value === "string" && value.length > 0;
  const cpfCnpjLengthValidation =
    (cpfCnpjExistValidation && cleanedCpfCnpj.length === 11) ||
    cleanedCpfCnpj.length === 14;
  const cpfCnpjValidation =
    cpfCnpjLengthValidation &&
    ((cleanedCpfCnpj.length === 11 ? isValidCPF(cleanedCpfCnpj) : false) ||
      (cleanedCpfCnpj.length === 14 ? isValidCNPJ(cleanedCpfCnpj) : false));

  return cpfCnpjExistValidation === false
    ? strings.cpfCnpjValidationNonExistingError
    : cpfCnpjLengthValidation === false
    ? strings.cpfCnpjValidationLengthError
    : cpfCnpjValidation === false
    ? strings.cpfCnpjValidationDigitError
    : undefined;
}

function paymentTypeValidation(value: string) {
  const paymentTypeExistValidation =
    typeof value === "string" &&
    value.length > 0 &&
    (value === "PIX" || value === "CREDIT_CARD");

  return paymentTypeExistValidation === false
    ? strings.paymentTypeValidationNonExistingError
    : undefined;
}

function phoneValidation(value: string) {
  const phoneExistValidation = typeof value === "string" && value.length > 0;

  const nonValidPhoneValidation = phoneExistValidation && value.length < 10;

  return phoneExistValidation === false
    ? strings.phoneValidationNonExistingError
    : nonValidPhoneValidation
    ? strings.phoneValidationNotValidError
    : undefined;
}

export default function validationBuilder<
  TTypeOfData extends ("name" | "cpfCnpj" | "phone" | "paymentType")[]
>(typesOfData: TTypeOfData) {
  const validationObject: any = {
    __cache: {} as {
      [key in TTypeOfData[number]]: {
        value: string;
        previousValidationReturn: boolean;
      };
    },
    isValidToSubmit: () => {
      let isValid = true;
      for (const typeOfData of typesOfData) {
        const validationData = validationObject[typeOfData](
          validationObject.__cache[typeOfData]?.value,
          true,
          true
        );
        if (validationData !== undefined) {
          isValid = false;
          break;
        }
      }
      return isValid;
    },
  };

  const validationWrapper = (
    type: TTypeOfData[number],
    callback: (
      value: string,
      hasTriedToSubmit?: boolean,
      force?: boolean
    ) => undefined | string
  ) => {
    return (value: string, hasTriedToSubmit = false, force = false) => {
      if (
        force === false &&
        typeof validationObject?.__cache?.[type] === "object" &&
        validationObject?.__cache?.[type]?.value === value
      )
        return validationObject.__cache?.[type].previousValidationReturn;
      const validationReturn = callback(value, hasTriedToSubmit, force);
      validationObject.__cache[type] = {
        value: value,
        previousValidationReturn: validationReturn,
      };
      return validationReturn;
    };
  };

  for (const typeOfData of typesOfData) {
    if (typeOfData === "name")
      validationObject[typeOfData] = validationWrapper(
        typeOfData,
        nameValidation
      );
    else if (typeOfData === "cpfCnpj")
      validationObject[typeOfData] = validationWrapper(
        typeOfData,
        cpfCnpjValidation
      );
    else if (typeOfData === "paymentType")
      validationObject[typeOfData] = validationWrapper(
        typeOfData,
        paymentTypeValidation
      );
    else if (typeOfData === "phone")
      validationObject[typeOfData] = validationWrapper(
        typeOfData,
        phoneValidation
      );
  }

  return validationObject as {
    [key in TTypeOfData[number]]: (
      value: string,
      hasTriedToSubmit?: boolean,
      force?: boolean
    ) => undefined | string;
  } & {
    isValidToSubmit: () => boolean;
  };
}
