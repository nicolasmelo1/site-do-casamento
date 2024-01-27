import { BillingTypes, PaymentListingResponse } from "./types";
import { callAsaasApi } from "./utils";

async function createANewPayment(
  customer: string,
  billingType: BillingTypes,
  value: number,
  description: string
) {
  const today = new Date();
  const dueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  )
    .toISOString()
    .split("T")[0];
  const response = await callAsaasApi("/v3/payments", "POST", {
    customer,
    billingType,
    value,
    dueDate,
    description,
  });
  const payment = await response.json();
  return payment;
}

async function pendingPaymentsForCustomer(
  customer: string
): Promise<PaymentListingResponse["data"][number] | undefined> {
  const searchParams = new URLSearchParams([
    ["customer", customer],
    ["status", "PENDING"],
  ]);
  const response = await callAsaasApi(
    `/v3/payments?${searchParams.toString()}`,
    "GET"
  );
  const payments = await response.json();

  if (payments.data.length > 0) return payments.data[0];
  return undefined;
}

async function getPixQrCode(paymentId: string) {
  const response = await callAsaasApi(
    `/v3/payments/${paymentId}/pixQrCode`,
    "GET"
  );
  const qrCode = await response.json();
  return qrCode;
}

async function getPixDataFromPaymentId(
  billingType: BillingTypes,
  paymentId: string
) {
  if (billingType !== "PIX") return {};
  const qrCodeResponse = await getPixQrCode(paymentId);
  return {
    copyAndPaste: qrCodeResponse.qrCodeUrl,
    base64Encoded: qrCodeResponse.encodedImage,
    pixDueDate: qrCodeResponse.pixDueDate,
  };
}

async function getDefaultValueFromPayment(
  payment: PaymentListingResponse["data"][number],
  billingType: BillingTypes,
  isPendingOnNewPayment = false
) {
  if (payment.deleted) return undefined;
  return {
    paymentId: payment.id,
    dateCreated: payment.dateCreated,
    isPendingOnNewPayment: isPendingOnNewPayment,
    value: payment.value,
    customerId: payment.customer,
    dueDate: payment.dueDate,
    pix: await getPixDataFromPaymentId(billingType, payment.id),
  };
}

async function getPaymentFromId(paymentId: string) {
  const response = await callAsaasApi(`/v3/payments/${paymentId}`, "GET");
  if (response.ok === false) return undefined;
  const payment = await response.json();
  return payment as PaymentListingResponse["data"][number];
}

/**
 * If the user clicks on the "Cancel" button, we should cancel the payment on the ASAAAS API.
 * First we get the payment data from the ASAAAS API, if the payment is not found, don't do anything.
 * If the payment is found, but it's not pending, don't do anything.
 * If the payment is found and it's pending, cancel the payment on the ASAAAS API.
 *
 * @param paymentId - The payment id to cancel.
 * @param why - The reason why the payment was canceled.
 */
export async function cancelPaymentFlow(paymentId: string, why?: string) {
  const payment = await getPaymentFromId(paymentId);
  if (typeof payment === "undefined") return;

  const isPendingPix =
    payment.status === "PENDING" && payment.billingType === "PIX";
  const isConfirmedOrReceivedCreditCard =
    ["RECEIVED", "CONFIRMED"].includes(payment.status) &&
    payment.billingType === "CREDIT_CARD";

  if (isPendingPix) await callAsaasApi(`/v3/payments/${paymentId}`, "DELETE");
  else if (isConfirmedOrReceivedCreditCard)
    await callAsaasApi(`/v3/payments/${paymentId}/refund`, "POST", {
      value: payment.value,
      description: why,
    });
}

export async function getPaymentDataFromPaymentId(paymentId: string) {
  const payment = await getPaymentFromId(paymentId);
  if (typeof payment === "undefined") return undefined;
  if (payment.deleted) return undefined;

  return getDefaultValueFromPayment(payment, payment.billingType);
}

/**
 * This flow is used for the first render of the page, by default we save the paymentId on the cookie so when we first render or refresh the page, we get that
 * payment id from the cookie, and then we get the payment data from the ASAAAS API. If the payment is not found, return undefined. If the payment is found, but it's not pending
 * return undefined as well. If the payment is found and it's pending, return the payment data.
 *
 * Why do we do that? So on the first render we can show the user that he has a pending payment that he should pay.
 *
 * @param paymentId - The payment id to get the payment data from the ASAAAS API. It's optional because we get it from the cookie.
 *
 * @returns - The payment data if the payment is pending, otherwise undefined.
 */
export async function getPendingPayment(paymentId?: string) {
  if (typeof paymentId !== "string") return undefined;

  const payment = await getPaymentFromId(paymentId);

  if (typeof payment === "undefined") return undefined;
  if (payment.status !== "PENDING") return undefined;
  if (payment.deleted) return undefined;

  return getDefaultValueFromPayment(payment, payment.billingType);
}

/**
 * This flow is used when the user clicks on the "Pay" button. We first check if there is a pending payment for the customer, if there is, we return the pending payment data, otherwise
 * we create a new payment and return the payment data.
 *
 * @param customer - The asaas customer id to create the payment for.
 * @param billingType - The billing type to create the payment for.
 * @param value - The value of the payment, how much we should charge the customer.
 * @param description - The description of the payment, what the customer is paying for.
 *
 * @returns - The payment data.
 */
export async function paymentFlow(
  customer: string,
  billingType: BillingTypes,
  value: number,
  description: string
) {
  const existingPendingPayment = await pendingPaymentsForCustomer(customer);

  if (existingPendingPayment)
    return getDefaultValueFromPayment(
      existingPendingPayment,
      billingType,
      true
    );

  const payment = await createANewPayment(
    customer,
    billingType,
    value,
    description
  );

  return getDefaultValueFromPayment(payment, billingType);
}
