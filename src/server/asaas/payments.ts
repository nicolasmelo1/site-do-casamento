import { callAsaasApi } from "./utils";

async function createANewPayment(
  customer: string,
  billingType: "BOLETO" | "CREDIT_CARD" | "PIX",
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

async function pendingPaymentsForCustomer(customer: string) {
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
  return payments;
}

async function getPixQrCode(paymentId: string) {
  const response = await callAsaasApi(
    `/v3/payments/${paymentId}/pixQrCode`,
    "GET"
  );
  const qrCode = await response.json();
  return qrCode;
}

export default async function paymentFlow(
  customer: string,
  billingType: "BOLETO" | "CREDIT_CARD" | "PIX",
  value: number,
  description: string
) {
  const getPixDataFromPaymentId = async (paymentId: string) => {
    if (billingType !== "PIX") return {};
    const qrCodeResponse = await getPixQrCode(paymentId);
    return {
      copyAndPaste: qrCodeResponse.qrCodeUrl,
      base64Encoded: qrCodeResponse.encodedImage,
      pixDueDate: qrCodeResponse.pixDueDate,
    };
  };

  const getDefaultValueFromPayment = async (
    payment: any,
    isPending = false
  ) => ({
    paymentId: payment.id,
    dateCreated: payment.dateCreated,
    isPending,
    value: payment.value,
    dueDate: payment.dueDate,
    pix: await getPixDataFromPaymentId(payment.id),
  });

  const existingPendingPayment = await pendingPaymentsForCustomer(customer);
  if (existingPendingPayment)
    return getDefaultValueFromPayment(existingPendingPayment, true);

  const payment = await createANewPayment(
    customer,
    billingType,
    value,
    description
  );
  return getDefaultValueFromPayment(payment);
}
