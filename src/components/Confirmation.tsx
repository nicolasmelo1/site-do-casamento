"use client";

import { Fragment, useState } from "react";

import {
  CONFIRMATION_CONFIRMATION_QUERY_PARAM,
  CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE,
  COOKIES_USERNAME,
  strings,
} from "../constants";
import { useCookieStorageState } from "../hooks";
import { Modal } from "./Utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function Confirmation(props: { cookies: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useCookieStorageState(
    props.cookies,
    COOKIES_USERNAME,
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
          <div className="flex flex-col justify-start items-start w-full">
            <label htmlFor="name" className="text-gray-100 font-semibold">
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
        </Modal>
      ) : null}
    </Fragment>
  );
}
