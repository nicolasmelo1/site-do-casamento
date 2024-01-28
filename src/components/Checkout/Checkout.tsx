"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  CHECKOUT_CONFIRMATION_QUERY_PARAM,
  CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE,
  CHECKOUT_PAYMENT_QUERY_PARAM,
  CHECKOUT_QUERY_PARAM,
  CHECKOUT_REMOVE_PAYMENT,
  COOKIES_BILLING_CURRENT_PAYMENT_ID,
  COOKIES_BILLING_CUSTOMER_ID,
} from "../../constants";
import Summary from "./Summary";
import Account from "./Account";
import Payment from "./Payment";
import { cancelPayment, handlePayment } from "../../app/actions";
import { useClickOutsideOfElement, useCookieStorageState } from "../../hooks";
import cookiesBuilder from "../../utils/cookies";
import type { getPendingPayment } from "../../server/asaas/payments";

export default function Checkout(props: {
  cookies: string;
  onRemovePresent: (index: number) => void;
  paymentData: Awaited<ReturnType<typeof getPendingPayment>>;
}) {
  const cookie = useMemo(() => cookiesBuilder(props.cookies), [props.cookies]);
  const [isNewPayment, setIsNewPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<
    Awaited<ReturnType<typeof getPendingPayment>>
  >(props.paymentData);
  const [, setPaymentId] = useCookieStorageState<string | undefined>(
    props.cookies,
    COOKIES_BILLING_CURRENT_PAYMENT_ID,
    undefined
  );
  const [, setCustomerId] = useCookieStorageState<string | undefined>(
    props.cookies,
    COOKIES_BILLING_CUSTOMER_ID,
    undefined
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const clickOutsideRef = useClickOutsideOfElement<HTMLDivElement>(() => {
    onDismiss();
  });
  const checkout = searchParams.get(CHECKOUT_QUERY_PARAM) || "";
  const confirm = searchParams.get(CHECKOUT_CONFIRMATION_QUERY_PARAM);
  const payment = searchParams.get(CHECKOUT_PAYMENT_QUERY_PARAM);

  const checkoutSplit = checkout.split(",");
  const checkoutSplitNumbers = checkoutSplit.map(Number);
  const isValidCheckout =
    checkoutSplit.length > 0 &&
    checkoutSplit.every(
      (index) => isNaN(Number(index)) === false && /\d+/g.test(index)
    );
  const isValidConfirm =
    isValidCheckout && confirm === CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE;
  const isValidPayment = typeof payment === "string" && payment.length > 0;

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

  function onCancelPayment() {
    if (typeof payment !== "string" || payment.length === 0) return;
    cancelPayment(payment).then(() => {
      setPaymentData(undefined);
      setPaymentId(undefined);
      const newSearchParamsArray = [];
      for (const [key, value] of Array.from(searchParams.entries())) {
        if (key === CHECKOUT_PAYMENT_QUERY_PARAM) continue;
        newSearchParamsArray.push([key, value]);
      }
      const newSearchParams = new URLSearchParams(newSearchParamsArray);
      const newSearchParamsAsString = newSearchParams.toString();
      if (newSearchParamsAsString.length === 0) return router.push("/");
      else router.push(`?${newSearchParamsAsString}`);
    });
  }

  /**
   * Used to handle and submit the payment. It will create a new payment on ASAAS and redirect the user to the payment page.
   */
  function onPay(
    name: string,
    cpfCnpj: string,
    paymentType: "PIX" | "CREDIT_CARD"
  ) {
    handlePayment(name, cpfCnpj, paymentType, 10).then((paymentData) => {
      if (paymentData === undefined) return;
      setPaymentId(paymentData?.paymentId);
      setCustomerId(paymentData?.customerId);
      setPaymentData(paymentData);
      setIsNewPayment(true);

      if (typeof window !== "undefined")
        window.open(paymentData.invoiceUrl, "_blank");

      const newSearchParamsArray = [];
      for (const [key, value] of Array.from(searchParams.entries())) {
        if (key === CHECKOUT_PAYMENT_QUERY_PARAM) continue;
        newSearchParamsArray.push([key, value]);
      }
      newSearchParamsArray.push([
        CHECKOUT_PAYMENT_QUERY_PARAM,
        paymentData?.paymentId,
      ]);
      const newSearchParams = new URLSearchParams(newSearchParamsArray);
      router.push(`?${newSearchParams.toString()}`);
    });
  }

  function onDismiss() {
    cookie.set(CHECKOUT_REMOVE_PAYMENT, "", { maxAge: 10 });
    router.push("/");
    setPaymentData(undefined);
  }

  return isValidCheckout || isValidConfirm || isValidPayment ? (
    <div className="flex justify-center items-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-40 z-10 overflow-hidden">
      <div
        ref={clickOutsideRef}
        className="flex flex-col justify-between w-6/12 min-w-96 max-w-2xl min-h-96 h-screen md:max-h-[60vh] max-h-[50vh] bg-red-400 p-6 rounded-2xl"
      >
        {isValidPayment && paymentData ? (
          <Payment
            isNewPayment={isNewPayment}
            paymentData={paymentData}
            onDismiss={onDismiss}
            onCancel={onCancelPayment}
          />
        ) : isValidConfirm ? (
          <Account cookies={props.cookies} checkout={checkout} onPay={onPay} />
        ) : isValidCheckout ? (
          <Summary
            cookies={props.cookies}
            checkout={checkoutSplitNumbers}
            onRemovePresent={onRemovePresent}
            onGoToAccount={onGoToAccount}
          />
        ) : null}
      </div>
    </div>
  ) : null;
}
