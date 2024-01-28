import { Fragment } from "react";

import type { getPendingPayment } from "../../server/asaas/payments";
import { displayDate, displayValueInCurrency } from "../../utils";
import { strings } from "../../constants";

export default function Payment(props: {
  onCancel: () => void;
  onDismiss: () => void;
  isNewPayment: boolean;
  paymentData: Awaited<ReturnType<typeof getPendingPayment>>;
}) {
  return (
    <Fragment>
      <div className="flex flex-col justify-between items-center h-full">
        {props.paymentData?.isPendingOnNewPayment === true ? (
          <p className="text-center">
            {strings.checkoutPaymentExistingPaymentOnNewPaymentError}
          </p>
        ) : props.isNewPayment === false ? (
          <p className="text-center">
            {strings.checkoutPaymentExistingPaymentOnFirstRenderError}
          </p>
        ) : null}
        {props.paymentData ? (
          <a
            href={props.paymentData.invoiceUrl}
            className="flex flex-row w-full justify-between items-center pt-2 pb-2 pr-6 pl-6 border-red-300 border-2 rounded-md"
            target="_blank"
          >
            <div className="flex flex-col">
              <p className="text-start text-2xl">
                {props.paymentData.billingType === "PIX"
                  ? strings.checkoutPaymentCardPixTitle
                  : props.paymentData.billingType === "CREDIT_CARD"
                  ? strings.checkoutPaymentCardCreditCardTitle
                  : ""}
              </p>
              <span className="flex flex-row mt-3">
                <p className="text-red-200 mr-2">
                  {strings.checkoutPaymentCardValueLabel}
                </p>
                <p className="font-bold">
                  {displayValueInCurrency(props.paymentData.value)}
                </p>
              </span>
              <span className="flex flex-row mt-1">
                <p className="text-red-200 mr-2">
                  {strings.checkoutPaymentCardDueDateLabel}
                </p>
                <p className="font-bold">
                  {displayDate(new Date(props.paymentData.dueDate))}
                </p>
              </span>
            </div>
            <p className="text-white">
              {strings.checkoutPaymentCardClickToPayLabel}
            </p>
          </a>
        ) : null}
        <div className="flex md:flex-col md:w-full flex-row justify-between items-center w-full">
          {props.paymentData?.paymentId &&
          props.paymentData?.paymentId.length > 0 ? (
            <button
              type="button"
              className="md:w-full cursor-pointer text-white text-bold pt-2 pb-2 pr-4 pl-4 rounded-xl font-semibold border-white border-2 w-1/3 text-center hover:bg-red-300"
              onClick={(e) => {
                e.preventDefault();
                props.onCancel();
              }}
            >
              {strings.checkoutPaymentCancelButton}
            </button>
          ) : null}
          <button
            type="button"
            className="md:w-full md:mt-3 cursor-pointer bg-white text-red-400 font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl w-1/3 h-full hover:bg-red-100"
            onClick={(e) => {
              e.preventDefault();
              props.onDismiss();
            }}
          >
            {strings.checkoutPaymentPayLaterButton}
          </button>
        </div>
      </div>
    </Fragment>
  );
}
