"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";

import { CHECKOUT_QUERY_PARAM } from "../../constants";
import { useCookieStorageState } from "../../hooks";
import { strings } from "../../constants";
import { isValidCNPJ, isValidCPF } from "../../utils";

export default function Account(props: {
  cookies: string;
  checkout: string;
  onPay: (name: string, cpfCnpj: string) => void;
}) {
  const [hasTriedToSubmit, setHasTriedToSubmit] = useCookieStorageState(
    props.cookies,
    "hasTriedToSubmit",
    false
  );
  const [name, setName] = useCookieStorageState(
    props.cookies,
    "username",
    "" as string
  );
  const [cpfCnpj, setCpfCnpj] = useCookieStorageState(
    props.cookies,
    "checkoutCpfCnpj",
    "" as string
  );

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

  return (
    <Fragment>
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
            {typeof validationErrors.name === "string" ? (
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
            {typeof validationErrors.cpfCnpj === "string" ? (
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
              props.onPay(name, cpfCnpj);
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Fragment>
  );
}
