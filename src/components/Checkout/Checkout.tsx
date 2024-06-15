"use client";

import dynamic from "next/dynamic";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";

import {
  CHECKOUT_CONFIRMATION_QUERY_PARAM,
  CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE,
  CHECKOUT_PAYMENT_QUERY_PARAM,
  CHECKOUT_QUERY_PARAM,
  CHECKOUT_REMOVE_PAYMENT,
  COOKIES_BILLING_CURRENT_PAYMENT_ID,
  COOKIES_BILLING_CUSTOMER_ID,
  getPresents,
} from "../../constants";
import { cancelPayment, handlePayment } from "../../app/actions";
import { useClickOutsideOfElement, useCookieStorageState } from "../../hooks";
import cookiesBuilder from "../../utils/cookies";
import { Modal } from "../Utils";

import type { getPendingPayment } from "../../server/asaas/payments";

const LazyAccount = dynamic(() => import("./Account"), { ssr: false });
const LazyPayment = dynamic(() => import("./Payment"), { ssr: false });
const LazySummary = dynamic(() => import("./Summary"), { ssr: false });

export default function Checkout(props: {
  cookies: string;
  isDevMode: boolean;
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
  useClickOutsideOfElement<HTMLDivElement>(() => {
    onDismiss();
  });
  const checkout = searchParams.get(CHECKOUT_QUERY_PARAM) || "";
  const confirm = searchParams.get(CHECKOUT_CONFIRMATION_QUERY_PARAM);
  const payment = searchParams.get(CHECKOUT_PAYMENT_QUERY_PARAM);

  const checkoutSplit = checkout.split(",");
  const checkoutSplitNumbers = checkoutSplit
    .map(Number)
    .filter((index) => getPresents(props.isDevMode)[index] !== undefined);
  const isValidCheckout =
    checkoutSplit.length > 0 &&
    checkoutSplit.every(
      (index) => isNaN(Number(index)) === false && /\d+/g.test(index)
    );
  const isValidConfirm =
    isValidCheckout && confirm === CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE;
  const isValidPayment = typeof payment === "string" && payment.length > 0;

  function onGoToAccount() {
    console.log("aquiiiii");
    const newSearchParams = new URLSearchParams(document.location.search);
    newSearchParams.set(
      CHECKOUT_CONFIRMATION_QUERY_PARAM,
      CHECKOUT_CONFIRMATION_QUERY_PARAM_VALUE
    );
    newSearchParams.set(CHECKOUT_QUERY_PARAM, checkout);
    router.push(`?${newSearchParams.toString()}`);
  }

  function onRemovePresent(presentIndex: number) {
    const newCheckout = checkoutSplitNumbers?.filter(
      (index) => index !== presentIndex
    );
    props.onRemovePresent(presentIndex);
    if (newCheckout?.length === 0) return router.push("/");

    const newSearchParams = new URLSearchParams(document.location.search);
    newSearchParams.set(CHECKOUT_QUERY_PARAM, newCheckout?.join(","));

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
    paymentType: "PIX" | "CREDIT_CARD",
    message?: string,
    isDevMode?: boolean
  ) {
    const sumOfCheckout = checkoutSplitNumbers.reduce(
      (accumulator, checkoutIndex) =>
        accumulator + getPresents(isDevMode)[checkoutIndex].value,
      0
    );
    handlePayment(name, cpfCnpj, paymentType, message, sumOfCheckout).then(
      (paymentData) => {
        if (paymentData === undefined) return;
        setPaymentId(paymentData?.paymentId);
        setCustomerId(paymentData?.customerId);
        setPaymentData(paymentData);
        setIsNewPayment(true);

        if (typeof paymentData.invoiceUrl === 'string') {
          router.push(paymentData.invoiceUrl);
          return;
        }

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
      }
    );
  }

  function onDismiss() {
    cookie.set(CHECKOUT_REMOVE_PAYMENT, "", { maxAge: 10 });
    router.push("/");
    setPaymentData(undefined);
  }

  return isValidCheckout || isValidConfirm || isValidPayment ? (
    <Modal
      className="flex flex-col justify-between w-6/12 min-w-96 max-w-2xl min-h-96 h-screen md:max-h-[80vh] max-h-[60vh] bg-white p-6 rounded-2xl"
      onClose={onDismiss}
    >
      <Fragment>
        {isValidPayment && paymentData ? (
          <LazyPayment
            isNewPayment={isNewPayment}
            paymentData={paymentData}
            onDismiss={onDismiss}
            onCancel={onCancelPayment}
          />
        ) : isValidConfirm ? (
          <LazyAccount
            cookies={props.cookies}
            checkout={checkout}
            onPay={onPay}
            isDevMode={props.isDevMode}
          />
        ) : isValidCheckout ? (
          <LazySummary
            isDevMode={props.isDevMode}
            cookies={props.cookies}
            checkout={checkoutSplitNumbers}
            onRemovePresent={onRemovePresent}
            onGoToAccount={onGoToAccount}
          />
        ) : null}
      </Fragment>
    </Modal>
  ) : null;
}
