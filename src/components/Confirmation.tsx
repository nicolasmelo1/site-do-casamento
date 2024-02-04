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
import { useCookieStorageState, useValidation } from "../hooks";
import { Modal } from "./Utils";
import { useRouter, useSearchParams } from "next/navigation";
import { formatterOfCpfCnpj } from "../utils/cpf-cnpj";
import { formatterOfPhone } from "../utils";
import { confirmPresence } from "../app/actions";

export default function Confirmation(props: { cookies: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNotGoingTimes, setIsNotGoingTimes] = useState<number | undefined>(
    undefined
  );
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

  const { validation, setHasTriedToSubmit } = useValidation(
    props.cookies,
    {
      name,
      cpfCnpj,
      phone,
    },
    "confirmationHasTriedSubmit"
  );

  function onClose() {
    router.push(`/`);
    setIsNotGoingTimes(undefined);
  }

  function onConfirmOrNotPresence(isGoing = true) {
    confirmPresence(name, cpfCnpj, phone, isGoing).then(() => {
      onClose();
    });
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
        {strings.confirmationConfirmButtonLabel}
      </button>
      {searchParams.has(CONFIRMATION_CONFIRMATION_QUERY_PARAM) ? (
        <Modal
          className="flex flex-col justify-between w-6/12 min-w-96 max-w-4xl min-h-96 h-screen md:max-h-[60vh] max-h-[50vh] bg-white p-6 rounded-2xl"
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
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border-2 border-gray-200 rounded-md"
                id="name"
                autoComplete="off"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {typeof validation.name === "string" ? (
                <p className="text-sm text-red-300">{validation.name}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full mt-3">
              <label htmlFor="cpfCnpj" className="text-red-400 font-semibold">
                {strings.confirmationCpfCnpjLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border-2 border-gray-200 rounded-md"
                id="cpfCnpj"
                type="text"
                value={formatterOfCpfCnpj(cpfCnpj)}
                onChange={(e) => setCpfCnpj(e.target.value.replace(/\D/g, ""))}
              />
              {typeof validation.cpfCnpj === "string" && cpfCnpj.length > 0 ? (
                <p className="text-sm text-red-300">{validation.cpfCnpj}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full mt-3">
              <label htmlFor="phone" className="text-red-400 font-semibold">
                {strings.confirmationPhoneLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border-2 border-gray-200 rounded-md"
                id="phone"
                type="text"
                value={formatterOfPhone(phone)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              {typeof validation.phone === "string" ? (
                <p className="text-sm text-red-300">{validation.phone}</p>
              ) : null}
            </div>
          </div>
          <div className="flex md:flex-col md:w-full flex-row justify-between items-center w-full">
            <Link
              className="md:w-full cursor-pointer text-red-400 text-bold pt-2 pb-2 pr-4 pl-4 rounded-xl font-semibold border-red-400 border-2 w-1/3 text-center hover:bg-red-100 h-full justify-center items-center"
              href={`/`}
            >
              {strings.checkoutAccountPaymentGoBackButton}
            </Link>
            <div className="md:w-full flex flex-row w-1/2 items-center justify-end">
              <button
                className={`md:mt-3 cursor-pointer bg-red-300 text-white font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl hover:bg-red-200 mr-3  ${
                  typeof isNotGoingTimes === "number" && isNotGoingTimes < 4
                    ? "absolute " +
                      (isNotGoingTimes === 2
                        ? "top-1 left-5"
                        : isNotGoingTimes === 3
                        ? "bottom-3 right-2"
                        : isNotGoingTimes === 4
                        ? "top-44 right-32"
                        : "")
                    : "md:w-full w-1/2 h-full md:mt-3"
                }`}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  const shouldTiltButton =
                    (typeof isNotGoingTimes === "number" &&
                      isNotGoingTimes < 4) ||
                    isNotGoingTimes === undefined;
                  if (shouldTiltButton)
                    setIsNotGoingTimes((prev) => (prev ? prev + 1 : 1));
                  else {
                    setHasTriedToSubmit(true);
                    onConfirmOrNotPresence(false);
                  }
                }}
              >
                {typeof isNotGoingTimes === "number" && isNotGoingTimes < 5
                  ? isNotGoingTimes === 1
                    ? "Vai sim"
                    : isNotGoingTimes === 2
                    ? "Para, é obvio que vc vai"
                    : isNotGoingTimes === 3
                    ? "É sério, para de clicar"
                    : "Vc não vai mesmo 😥"
                  : "Não vou"}
              </button>
              <button
                type="submit"
                className={`md:w-full md:mt-3 cursor-pointer bg-red-400 text-white font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl w-1/2 h-full hover:bg-red-300 ${
                  validation.isValidToSubmit() === false ? "bg-opacity-50" : ""
                }`}
                disabled={validation.isValidToSubmit() === false}
                onClick={(e) => {
                  e.preventDefault();
                  setHasTriedToSubmit(true);
                  onConfirmOrNotPresence(true);
                }}
              >
                {strings.checkoutAccountPaymentConfirmButton}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </Fragment>
  );
}
