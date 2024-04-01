"use client";

import { Fragment, useState } from "react";
import Link from "next/link";

import {
  CHECKOUT_QUERY_PARAM,
  COOKIES_CPF_CNPJ,
  COOKIES_USERNAME,
  DEV_MODE_QUERY_PARAM,
} from "../../constants";
import { useCookieStorageState, useValidation } from "../../hooks";
import { strings } from "../../constants";
import { formatterOfCpfCnpj } from "../../utils/cpf-cnpj";

export default function Account(props: {
  cookies: string;
  checkout: string;
  isDevMode: boolean;
  onPay: (
    name: string,
    cpfCnpj: string,
    paymentType: "CREDIT_CARD" | "PIX",
    message?: string,
    isDevMode?: boolean
  ) => void;
}) {
  const [name, setName] = useCookieStorageState(
    props.cookies,
    COOKIES_USERNAME,
    "" as string
  );
  const [cpfCnpj, setCpfCnpj] = useCookieStorageState(
    props.cookies,
    COOKIES_CPF_CNPJ,
    "" as string
  );
  const [paymentType, setPaymentType] = useCookieStorageState<
    "PIX" | "CREDIT_CARD" | undefined
  >(props.cookies, "checkoutPaymentType", undefined);
  const [message, setMessage] = useState("");

  const params = new URLSearchParams(
    typeof document !== "undefined" ? document.location.search : []
  );
  const urlToGoBack = new URLSearchParams(
    [[CHECKOUT_QUERY_PARAM, props.checkout]].concat(
      params.has(DEV_MODE_QUERY_PARAM) ? [[DEV_MODE_QUERY_PARAM, "true"]] : []
    )
  );

  const { setHasTriedToSubmit, validation } = useValidation(
    props.cookies,
    {
      name: name,
      cpfCnpj: cpfCnpj,
      paymentType: paymentType,
    },
    "checkoutTriedToSubmit"
  );

  return (
    <Fragment>
      <div className="flex w-full h-full justify-between flex-col items-stretch">
        <div className="flex flex-col justify-between items-center w-full h-full">
          <div className="flex flex-row items-start w-full">
            <h1 className="text-xl">{strings.checkoutAccountTitle}</h1>
          </div>
          <div className="flex flex-col w-full pb-3 pt-3">
            <div className="flex flex-col justify-start items-start w-full">
              <label htmlFor="name" className="text-gray-800 font-semibold">
                {strings.checkoutAccountNameLabel}
                <span className="text-gray-800">*</span>
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {typeof validation.name === "string" ? (
                <p className="text-sm text-red-200">{validation.name}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full pt-6">
              <label htmlFor="cpfCnpj" className="text-gray-800 font-semibold">
                {strings.checkoutAccountCpfCnpjLabel}
                <span className="text-gray-800">*</span>
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="cpfCnpj"
                type="text"
                value={formatterOfCpfCnpj(cpfCnpj)}
                onChange={(e) => {
                  setCpfCnpj(e.target.value.replace(/\D/g, ""));
                }}
              />
              {typeof validation.cpfCnpj === "string" ? (
                <p className="text-sm text-red-200">{validation.cpfCnpj}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full pt-6">
              <label htmlFor="type" className="text-gray-800 font-semibold">
                {strings.checkoutAccountPaymentTypeLabel}
                <span className="text-gray-800">*</span>
              </label>
              <select
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md border-gray-300"
                id="type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as any)}
              >
                <option value="" disabled={true} selected={true} hidden={true}>
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
            <div className="flex flex-col justify-start items-start w-full pt-6">
              <label htmlFor="message" className="text-gray-800 font-semibold">
                {strings.checkoutAccountMessageLabel}
              </label>
              <textarea
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md resize-none border-gray-300"
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value as any)}
              />
            </div>
          </div>
          <div className="flex md:flex-col md:w-full flex-row justify-between items-center w-full">
            <Link
              className="md:w-full cursor-pointer text-gray-800 text-bold pt-2 pb-2 pr-4 pl-4 rounded-xl font-semibold border-gray-800 border-2 w-1/3 text-center hover:bg-gray-300"
              href={`?${urlToGoBack.toString()}`}
              onClick={() => {
                setHasTriedToSubmit(false);
              }}
            >
              {strings.checkoutAccountPaymentGoBackButton}
            </Link>
            <button
              type="submit"
              className={`md:w-full md:mt-3 cursor-pointer bg-gray-800 text-white font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl w-1/3 h-full hover:bg-gray-500 ${
                validation.isValidToSubmit() === false ? "bg-opacity-50" : ""
              }`}
              disabled={validation.isValidToSubmit() === false}
              onClick={(e) => {
                e.preventDefault();
                setHasTriedToSubmit(true);
                if (validation.isValidToSubmit() === false) return;

                props.onPay(
                  name,
                  cpfCnpj,
                  paymentType as any,
                  message,
                  props.isDevMode
                );
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
