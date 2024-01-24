"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  CHECKOUT_CONFIRMATION_QUERY_PARAM,
  CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE,
  CHECKOUT_QUERY_PARAM,
} from "../../constants";
import Summary from "./Summary";
import Account from "./Account";

export default function Checkout(props: {
  onRemovePresent: (index: number) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkout = searchParams.get(CHECKOUT_QUERY_PARAM) || "";
  const confirm = searchParams.get(CHECKOUT_CONFIRMATION_QUERY_PARAM);
  const checkoutSplit = checkout.split(",");
  const checkoutSplitNumbers = checkoutSplit.map(Number);
  const isValidCheckout =
    checkoutSplit.length > 0 &&
    checkoutSplit.every(
      (index) => isNaN(Number(index)) === false && /\d+/g.test(index)
    );
  const isValidConfirm =
    isValidCheckout && confirm === CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE;

  function onGoToAccount() {
    const newSearchParams = new URLSearchParams([
      [CHECKOUT_QUERY_PARAM, checkout],
      [
        CHECKOUT_CONFIRMATION_QUERY_PARAM,
        CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE,
      ],
    ]);
    router.push(`?${newSearchParams.toString()}`);
  }

  function onRemovePresent(presentIndex: number) {
    const newCheckout = checkoutSplitNumbers?.filter(
      (index) => index !== presentIndex
    );
    props.onRemovePresent(presentIndex);
    if (newCheckout?.length === 0) return router.push("/");

    const newSearchParams = new URLSearchParams([
      [CHECKOUT_QUERY_PARAM, newCheckout?.join(",")],
    ]);
    router.push(`?${newSearchParams.toString()}`);
  }

  return isValidCheckout || isValidConfirm ? (
    <div className="flex justify-center items-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-40 z-10 overflow-hidden">
      {isValidConfirm ? (
        <Account checkout={checkout} />
      ) : isValidCheckout ? (
        <Summary
          checkout={checkoutSplitNumbers}
          onRemovePresent={onRemovePresent}
          onGoToAccount={onGoToAccount}
        />
      ) : null}
    </div>
  ) : null;
}
