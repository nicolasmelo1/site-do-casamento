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
  onPay: (
    name: string,
    cpfCnpj: string,
    paymentType: "CREDIT_CARD" | "PIX"
  ) => void;
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
  const [paymentType, setPaymentType] = useCookieStorageState<
    "PIX" | "CREDIT_CARD" | undefined
  >(props.cookies, "checkoutPaymentType", undefined);

  const validationErrors = useMemo(() => {
    return getValidationErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, cpfCnpj, paymentType, getValidationErrors, hasTriedToSubmit]);

  const urlToGoBack = new URLSearchParams([
    [CHECKOUT_QUERY_PARAM, props.checkout],
  ]);

  function getValidationErrors(force: boolean = false) {
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

    const paymentTypeExistValidation =
      typeof paymentType === "string" &&
      paymentType.length > 0 &&
      (paymentType === "PIX" || paymentType === "CREDIT_CARD");
    const paymentTypeValidation = {
      name:
        nameExistValidation === false &&
        (force === true || hasTriedToSubmit === true)
          ? strings.checkoutNameValidationNonExistingError
          : fullNameValidation === false
          ? strings.checkoutNameValidationFullNameError
          : undefined,
      cpfCnpj:
        cpfCnpjExistValidation === false &&
        (force === true || hasTriedToSubmit === true)
          ? strings.checkoutCpfCnpjValidationNonExistingError
          : cpfCnpjLengthValidation === false
          ? strings.checkoutCpfCnpjValidationLengthError
          : cpfCnpjValidation === false
          ? strings.checkoutCpfCnpjValidationDigitError
          : undefined,
      paymentType:
        paymentTypeExistValidation === false &&
        (force === true || hasTriedToSubmit === true)
          ? strings.checkoutPaymentTypeValidationNonExistingError
          : undefined,
    };
    return {
      ...paymentTypeValidation,
      isValidToSubmit: Object.values(paymentTypeValidation).every(
        (value) => value === undefined
      ),
    };
  }

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
          <div className="flex flex-col justify-start items-start w-full pr-6 pl-6 pt-6">
            <label htmlFor="type">Tipo de pagamento</label>
            <select
              className="w-full pt-1 pb-1 pl-3 pr-3 border rounded-md"
              id="type"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as any)}
            >
              <option value="" disabled selected>
                Selecione uma opção
              </option>
              <option value="PIX">Pix</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
            </select>
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
            disabled={
              validationErrors.name !== undefined ||
              validationErrors.cpfCnpj !== undefined ||
              paymentType === undefined
            }
            onClick={(e) => {
              e.preventDefault();
              setHasTriedToSubmit(true);
              const validationErrors = getValidationErrors(true);
              if (validationErrors.isValidToSubmit === false) return;

              props.onPay(name, cpfCnpj, paymentType as any);
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Fragment>
  );
}
