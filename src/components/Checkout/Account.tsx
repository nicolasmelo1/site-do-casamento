"use client";

import Link from "next/link";
import { CHECKOUT_QUERY_PARAM } from "../../constants";
import { useHasMounted, useLocalStorageState } from "../../hooks";
import { strings } from "../../constants";
import { useMemo } from "react";
import { isValidCNPJ, isValidCPF } from "../../utils";
import { handlePayment } from "../../app/actions";

export default function Account(props: { checkout: string }) {
  const [hasTriedToSubmit, setHasTriedToSubmit] = useLocalStorageState(
    "hasTriedToSubmit",
    false
  );
  const [name, setName] = useLocalStorageState("username", "" as string);
  const [cpfCnpj, setCpfCnpj] = useLocalStorageState(
    "checkoutCpfCnpj",
    "" as string
  );
  const hasMounted = useHasMounted();

  const validationErrors = useMemo(() => {
    const nameExistValidation = typeof name === "string" && name.length > 0;
    const fullNameValidation = nameExistValidation
      ? name.split(" ").length > 1
      : true;

    const cleanedCpfCnpj =
      typeof cpfCnpj === "string" ? cpfCnpj.replace(/[\.\-\/]/g, "") : "";
    const cpfCnpjExistValidation =
      typeof cpfCnpj === "string" && cpfCnpj.length > 0;
    const cpfCnpjLengthValidation =
      (cpfCnpjExistValidation && cleanedCpfCnpj.length === 11) ||
      cleanedCpfCnpj.length === 14;
    const cpfCnpjValidation =
      cpfCnpjLengthValidation &&
      ((cleanedCpfCnpj.length === 11 ? isValidCPF(cleanedCpfCnpj) : false) ||
        (cleanedCpfCnpj.length === 14 ? isValidCNPJ(cleanedCpfCnpj) : false));
    return {
      name:
        nameExistValidation === false && hasTriedToSubmit === true
          ? strings.checkoutNameValidationNonExistingError
          : fullNameValidation === false
          ? strings.checkoutNameValidationFullNameError
          : undefined,
      cpfCnpj:
        cpfCnpjExistValidation === false && hasTriedToSubmit === true
          ? strings.checkoutCpfCnpjValidationNonExistingError
          : cpfCnpjLengthValidation === false
          ? strings.checkoutCpfCnpjValidationLengthError
          : cpfCnpjValidation === false
          ? strings.checkoutCpfCnpjValidationDigitError
          : undefined,
    };
  }, [name, cpfCnpj, hasTriedToSubmit]);

  const urlToGoBack = new URLSearchParams([
    [CHECKOUT_QUERY_PARAM, props.checkout],
  ]);

  console.log("validationErrors", validationErrors.name);
  return (
    <div className="flex flex-col justify-between w-6/12 min-w-96 max-w-2xl h-96 bg-blue-100">
      <div className="flex w-full h-full justify-between flex-col items-stretch">
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col justify-start items-start w-full pr-6 pl-6">
            <label htmlFor="name">Nome</label>
            <input
              className="w-full pt-1 pb-1 pl-3 pr-3 border rounded-md"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {typeof validationErrors.name === "string" && hasMounted ? (
              <p className="text-sm text-red-400">{validationErrors.name}</p>
            ) : null}
          </div>
          <div className="flex flex-col justify-start items-start w-full pr-6 pl-6 pt-6">
            <label htmlFor="cpfCnpj">CPF/CNPJ</label>
            <input
              className="w-full pt-1 pb-1 pl-3 pr-3 border rounded-md"
              id="cpfCnpj"
              type="text"
              value={cpfCnpj}
              onChange={(e) => setCpfCnpj(e.target.value)}
            />
            {typeof validationErrors.cpfCnpj === "string" && hasMounted ? (
              <p className="text-sm text-red-400">{validationErrors.cpfCnpj}</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-row justify-between items-start w-full cursor-pointer">
          <Link
            href={`?${urlToGoBack.toString()}`}
            onClick={() => {
              setHasTriedToSubmit(false);
            }}
          >
            Voltar
          </Link>
          <button
            type="submit"
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setHasTriedToSubmit(true);
              handlePayment(name, cpfCnpj, 10);
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
