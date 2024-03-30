"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { CHECKOUT_QUERY_PARAM, presents } from "../constants";
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

  const presentsArray = presents.concat([
    {
      description: "Teste",
      imageUrl: "/images/placeholder.png",
      title: "Teste",
      value: 1,
    },
  ]);
  return (
    <Fragment>
      <div className="flex flex-row flex-wrap justify-center items-center">
        {presentsArray.map((present, index) => (
          <button
            className="flex flex-col justify-center items-center p-2 m-2 border-2 border-red-400 rounded-3xl 
            w-[23vw] h-[23vw] max-w-[384px] max-h-[384px] min-w-[320px] min-h-[320px] hover:bg-red-50 hover:shadow-gray-400 hover:shadow-inner select-none"
            title={present.title}
            type={"button"}
            key={index}
            onClick={(e) => {
              e.preventDefault();
              const newPresentIndexes = Array.from(
                new Set([...presentsIndexes, index])
              );
              setPresentIndexes(newPresentIndexes);
              const newSearchParams = new URLSearchParams([
                [CHECKOUT_QUERY_PARAM, newPresentIndexes.join(",")],
              ]);
              router.push(`?${newSearchParams.toString()}`);
            }}
          >
            <div className={"flex flex-col w-32 h-32 relative"}>
              <Image
                src={present.imageUrl}
                alt={present.title}
                fill={true}
                className="object-cover rounded-3xl"
              />
            </div>
            <h4 className="text-2xl text-gray-600">{present.title}</h4>
            <p className="text-xs mt-2 text-gray-500">{present.description}</p>
            <p className="text-md mt-4 text-gray-700">
              {displayValueInCurrency(present.value)}
            </p>
            <div className="bg-red-400 p-3 rounded-xl mt-3">
              <h2 className="text-white">Escolher</h2>
            </div>
          </button>
        ))}
      </div>
      <Checkout
        cookies={props.cookies}
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
