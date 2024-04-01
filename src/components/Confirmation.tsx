"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CONFIRMATION_CONFIRMATION_QUERY_PARAM,
  COOKIES_CPF_CNPJ,
  COOKIES_PHONE,
  COOKIES_USERNAME,
  strings,
} from "../constants";
import { useCookieStorageState, useValidation } from "../hooks";
import { formatterOfCpfCnpj } from "../utils/cpf-cnpj";
import { formatterOfPhone } from "../utils";
import { confirmPresence } from "../app/actions";

export default function Confirmation(props: {
  cookies: string;
  hasConfirmedOrNotPresence: boolean | undefined;
}) {
  const router = useRouter();
  const [wantToChangeConfirmation, setWantToChangeConfirmation] =
    useState<boolean>(false);

  const [hasConfirmedOrNotPresence, setHasConfirmedOrNotPresence] = useState<
    boolean | undefined
  >(props.hasConfirmedOrNotPresence);
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

  const { validation, hasTriedToSubmit, setHasTriedToSubmit } = useValidation(
    props.cookies,
    {
      name,
      cpfCnpj,
      phone,
    },
    "confirmationHasTriedSubmit"
  );

  function onConfirmOrNotPresence(isGoing = true) {
    setHasConfirmedOrNotPresence(isGoing);
    confirmPresence(name, cpfCnpj, phone, isGoing).then((newGuestId) => {
      const doesNotExistsNewGuestId = newGuestId === undefined;
      if (doesNotExistsNewGuestId) return;

      setWantToChangeConfirmation(false);
      setIsNotGoingTimes(undefined);
    });
  }

  useEffect(() => {
    const hasDocument = typeof document !== "undefined";
    if (hasDocument && document.location.search) {
      const searchParams = new URLSearchParams(document.location.search);
      const isGoing = searchParams.get(CONFIRMATION_CONFIRMATION_QUERY_PARAM);
      if (isGoing === "true") {
        const elementToScrollTo = document.getElementById(
          "confirme-sua-presenca"
        );
        if (elementToScrollTo) elementToScrollTo.scrollIntoView();
      }
    }
  }, []);

  return (
    <Fragment>
      {hasConfirmedOrNotPresence === undefined ||
      wantToChangeConfirmation === true ? (
        <Fragment>
          <div className="flex flex-col justify-start items-start w-full m-6">
            <div className="flex flex-col justify-start items-start w-full">
              <label htmlFor="name" className="text-gray-400 font-semibold">
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
              {typeof validation.name === "string" &&
              name.length > 0 &&
              hasTriedToSubmit === true ? (
                <p className="text-sm text-gray-300">{validation.name}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full mt-3">
              <label htmlFor="cpfCnpj" className="text-gray-400 font-semibold">
                {strings.confirmationCpfCnpjLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border-2 border-gray-200 rounded-md"
                id="cpfCnpj"
                type="text"
                value={formatterOfCpfCnpj(cpfCnpj)}
                onChange={(e) => setCpfCnpj(e.target.value.replace(/\D/g, ""))}
              />
              {typeof validation.cpfCnpj === "string" &&
              cpfCnpj.length > 0 &&
              hasTriedToSubmit === true ? (
                <p className="text-sm text-gray-300">{validation.cpfCnpj}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-start items-start w-full mt-3">
              <label htmlFor="phone" className="text-gray-400 font-semibold">
                {strings.confirmationPhoneLabel}
              </label>
              <input
                className="w-full pt-2 pb-2 sm:pt-3 sm:pb-3 pl-3 pr-3 border-2 border-gray-200 rounded-md"
                id="phone"
                type="text"
                value={formatterOfPhone(phone)}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              {typeof validation.phone === "string" &&
              phone.length > 0 &&
              hasTriedToSubmit === true ? (
                <p className="text-sm text-gray-300">{validation.phone}</p>
              ) : null}
            </div>
          </div>
          <div className="flex md:flex-col md:w-full flex-row justify-between items-center w-full mt-3">
            <button
              className={`md:mt-3 cursor-pointer border-[2px] border-gray-400 text-gray-400 font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl hover:bg-gray-200 mr-3${
                typeof isNotGoingTimes === "number" && isNotGoingTimes < 4
                  ? " absolute " +
                    (isNotGoingTimes === 1
                      ? " top-0"
                      : isNotGoingTimes === 2
                      ? " top-[50vh] left-5"
                      : isNotGoingTimes === 3
                      ? " top-[30vh] right-2"
                      : isNotGoingTimes === 4
                      ? " top-44 right-32"
                      : "")
                  : " md:w-full w-1/2 h-full md:mt-3"
              }`}
              style={
                typeof isNotGoingTimes === "number" && isNotGoingTimes < 4
                  ? {
                      zIndex: 1000,
                    }
                  : undefined
              }
              type="submit"
              disabled={validation.isValidToSubmit() === false}
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
                  ? strings.isNotGoingButtonLabel1
                  : isNotGoingTimes === 2
                  ? strings.isNotGoingButtonLabel2
                  : isNotGoingTimes === 3
                  ? strings.isNotGoingButtonLabel3
                  : strings.isNotGoingButtonLabel4
                : strings.isNotGoingButtonLabel}
            </button>
            <button
              type="submit"
              className={`md:w-full md:mt-3 cursor-pointer bg-gray-400 text-white font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl w-1/2 h-full hover:bg-gray-300 ${
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
        </Fragment>
      ) : (
        <div className="flex flex-row justify-center items-center w-full h-full mt-12 mb-12">
          <button
            type="button"
            className="flex flex-row justify-center font-semibold text-gray-400 items-center max-w-96 h-full p-3 rounded-2xl border-gray-400 border-[2px]  hover:bg-gray-200"
            onClick={() => setWantToChangeConfirmation(true)}
          >
            {hasConfirmedOrNotPresence
              ? strings.confirmationIsGoingButtonLabel
              : strings.confirmationIsNotGoingButtonLabel}
          </button>
        </div>
      )}
    </Fragment>
  );
}
