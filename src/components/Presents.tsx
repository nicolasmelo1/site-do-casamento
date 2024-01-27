"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";

import { CHECKOUT_QUERY_PARAM, presents } from "../constants";
import Checkout from "./Checkout";
import { useCookieStorageState } from "../hooks";

import type { firstRenderFlow } from "../server/asaas/payments";

export default function Presents(props: {
  cookies: string;
  paymentData: Awaited<ReturnType<typeof firstRenderFlow>>;
}) {
  const router = useRouter();
  const [presentsIndexes, setPresentIndexes] = useCookieStorageState(
    props.cookies,
    "presentIndexes",
    [] as number[]
  );

  return (
    <Fragment>
      {presents.map((present, index) => (
        <button
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
          {present.title}
        </button>
      ))}
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
