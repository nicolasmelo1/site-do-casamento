"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { CHECKOUT_QUERY_PARAM, getPresents } from "../constants";
import Checkout from "./Checkout";
import { useCookieStorageState } from "../hooks";
import { displayValueInCurrency } from "../utils";

import type { getPendingPayment } from "../server/asaas/payments";

export default function Presents(props: {
  cookies: string;
  isDevMode: boolean;
  paymentData: Awaited<ReturnType<typeof getPendingPayment>>;
}) {
  const router = useRouter();
  const [presentsIndexes, setPresentIndexes] = useCookieStorageState(
    props.cookies,
    "presentIndexes",
    [] as number[]
  );
  // max-w-[384px] max-h-[384px] min-w-[320px] min-h-[320px]
  return (
    <Fragment>
      <div className="flex flex-row flex-wrap justify-center items-center max-w-4xl">
        {getPresents(props.isDevMode).map((present, index) => (
          <button
            className="flex flex-col justify-between items-center p-2 m-2 border-2 border-gray-400 rounded-3xl 
            w-48 h-64 hover:bg-gray-50 hover:shadow-gray-400 hover:shadow-inner select-none"
            title={present.title}
            type={"button"}
            key={index}
            onClick={(e) => {
              e.preventDefault();
              const newPresentIndexes = Array.from(
                new Set([...presentsIndexes, index])
              );
              setPresentIndexes(newPresentIndexes);
              const newSearchParams = new URLSearchParams(
                document.location.search
              );
              newSearchParams.set(
                CHECKOUT_QUERY_PARAM,
                newPresentIndexes.join(",")
              );
              router.push(`?${newSearchParams.toString()}`);
            }}
          >
            <div className={"flex flex-col w-28 h-28 relative"}>
              <Image
                src={present.imageUrl}
                alt={present.title}
                fill={true}
                className="object-cover rounded-3xl"
              />
            </div>
            {/*<h4 className="text-2xl text-gray-600">{present.title}</h4>*/}
            <p className="text-xs mt-1 text-gray-500">{present.title}</p>
            <p className="text-md text-gray-700">
              {displayValueInCurrency(present.value)}
            </p>
            <div className="bg-gray-400 p-3 rounded-xl mt-3">
              <h2 className="text-white">Escolher</h2>
            </div>
          </button>
        ))}
      </div>
      <Checkout
        cookies={props.cookies}
        isDevMode={props.isDevMode}
        paymentData={props.paymentData}
        onRemovePresent={async (presentIndex) =>
          setPresentIndexes(
            presentsIndexes?.filter((index) => index !== presentIndex)
          )
        }
      />
    </Fragment>
  );
}
