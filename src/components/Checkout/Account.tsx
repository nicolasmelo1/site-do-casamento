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

  /**
   * This function is used to validate the form and return the validation errors for each field of the form. Really easy to use.
   *
   * @param force If true, the function will return the validation errors even if the user has not tried to submit the form yet.
   *
   * @returns An object with the validation errors for each field of the form and a boolean that indicates if the form is valid to submit.
   */
  function getValidationErrors(force: boolean = false) {
    const nameExistValidation = typeof name === "string" && name.length > 0;
    const fullNameValidation = nameExistValidation
      ? name.split(" ").length > 1 &&
        name.split(" ").every((value) => value !== "")
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
        <div className="flex flex-col justify-between items-center w-full h-full">
          <div className="flex flex-row items-start w-full">
            <h1 className="text-xl">{strings.checkoutAccountTitle}</h1>
          </div>
          <div className="flex flex-col w-full pb-3 pt-3">
            <div className="flex flex-col justify-start items-start w-full">
              <label htmlFor="name" className="text-gray-100 font-semibold">
                {strings.checkoutAccountNameLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {typeof validationErrors.name === "string" ? (
                <p className="text-sm text-red-200">{validationErrors.name}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full pt-6">
              <label htmlFor="cpfCnpj" className="text-gray-100 font-semibold">
                {strings.checkoutAccountCpfCnpjLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="cpfCnpj"
                type="text"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
              />
              {typeof validationErrors.cpfCnpj === "string" ? (
                <p className="text-sm text-red-200">
                  {validationErrors.cpfCnpj}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full pt-6">
              <label htmlFor="type" className="text-gray-100 font-semibold">
                {strings.checkoutAccountPaymentTypeLabel}
              </label>
              <select
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
              >
                <option value="" disabled>
                  {strings.checkoutAccountPaymentTypePlaceholderLabel}
                </option>
                <option value="PIX">
                  {strings.checkoutAccountPaymentTypePixOptionLabel}
                </option>
                <option value="CREDIT_CARD">
                  {strings.checkoutAccountPaymentTypeCreditCardOptionLabel}
                </option>
              </select>
            </div>
          </div>
          <div className="flex md:flex-col md:w-full flex-row justify-between items-center w-full">
            <Link
              className="md:w-full cursor-pointer text-white text-bold pt-2 pb-2 pr-4 pl-4 rounded-xl font-semibold border-white border-2 w-1/3 text-center hover:bg-red-300 h-full"
              href={`?${urlToGoBack.toString()}`}
              onClick={() => {
                setHasTriedToSubmit(false);
              }}
            >
              {strings.checkoutAccountPaymentGoBackButton}
            </Link>
            <button
              type="submit"
              className={`md:w-full md:mt-3 cursor-pointer bg-white text-red-400 font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl w-1/3 h-full hover:bg-red-100 ${
                validationErrors.name !== undefined ||
                validationErrors.cpfCnpj !== undefined ||
                paymentType === undefined
                  ? "bg-opacity-50"
                  : ""
              }`}
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
              {strings.checkoutAccountPaymentConfirmButton}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
