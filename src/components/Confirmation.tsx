"use client";

import { Fragment, useState } from "react";
import Link from "next/link";

import {
  CONFIRMATION_CONFIRMATION_QUERY_PARAM,
  CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE,
  COOKIES_CPF_CNPJ,
  COOKIES_PHONE,
  COOKIES_USERNAME,
  strings,
} from "../constants";
import { useCookieStorageState } from "../hooks";
import { Modal } from "./Utils";
import { useRouter, useSearchParams } from "next/navigation";
import { formatterOfCpfCnpj } from "../utils/cpf-cnpj";
import { formatterOfPhone } from "../utils";

export default function Confirmation(props: { cookies: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useCookieStorageState(
    props.cookies,
    COOKIES_USERNAME,
    ""
  );
  const [cpfCnpj, setCpfCnpj] = useCookieStorageState(
    props.cookies,
    COOKIES_CPF_CNPJ,
    ""
  );
  const [phone, setPhone] = useCookieStorageState(
    props.cookies,
    COOKIES_PHONE,
    ""
  );

  function onClose() {
    router.push(`/`);
  }

  return (
    <Fragment>
      <button
        type="button"
        className="flex flex-row justify-center items-center w-full h-full"
        onClick={() => {
          const newSearchParams = new URLSearchParams([
            [
              CONFIRMATION_CONFIRMATION_QUERY_PARAM,
              CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE,
            ],
          ]);
          router.push(`?${newSearchParams.toString()}`);
        }}
      >
        Confirmar presença
      </button>
      {searchParams.has(CONFIRMATION_CONFIRMATION_QUERY_PARAM) ? (
        <Modal
          className="flex flex-col justify-between w-6/12 min-w-96 max-w-2xl min-h-96 h-screen md:max-h-[60vh] max-h-[50vh] bg-white p-6 rounded-2xl"
          onClose={onClose}
        >
          <h2 className="text-black font-bold text-2xl text-start">
            {strings.confirmationTitle}
          </h2>
          <div>
            <div className="flex flex-col justify-start items-start w-full">
              <label htmlFor="name" className="text-red-400 font-semibold">
                {strings.confirmationNameLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {/*typeof validationErrors.name === "string" ? (
          <p className="text-sm text-red-200">{validationErrors.name}</p>
        ) : null*/}
            </div>
            <div className="flex flex-col justify-start items-start w-full mt-3">
              <label htmlFor="cpfCnpj" className="text-red-400 font-semibold">
                {strings.confirmationCpfCnpjLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="cpfCnpj"
                type="text"
                value={formatterOfCpfCnpj(cpfCnpj)}
                onChange={(e) => setCpfCnpj(e.target.value.replace(/\D/g, ""))}
              />
              {/*typeof validationErrors.name === "string" ? (
          <p className="text-sm text-red-200">{validationErrors.name}</p>
        ) : null*/}
            </div>
            <div className="flex flex-col justify-start items-start w-full mt-3">
              <label htmlFor="phone" className="text-red-400 font-semibold">
                {strings.confirmationPhoneLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border rounded-md"
                id="phone"
                type="text"
                value={formatterOfPhone(phone)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              {/*typeof validationErrors.name === "string" ? (
          <p className="text-sm text-red-200">{validationErrors.name}</p>
        ) : null*/}
            </div>
          </div>
          <div className="flex md:flex-col md:w-full flex-row justify-between items-center w-full">
            <Link
              className="md:w-full cursor-pointer text-red-400 text-bold pt-2 pb-2 pr-4 pl-4 rounded-xl font-semibold border-red-400 border-2 w-1/3 text-center hover:bg-red-100 h-full"
              href={`/`}
            >
              {strings.checkoutAccountPaymentGoBackButton}
            </Link>
            <button
              type="submit"
              className={`md:w-full md:mt-3 cursor-pointer bg-red-400 text-white font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl w-1/3 h-full hover:bg-red-300`}
              onClick={(e) => {}}
            >
              {strings.checkoutAccountPaymentConfirmButton}
            </button>
          </div>
        </Modal>
      ) : null}
    </Fragment>
  );
}
