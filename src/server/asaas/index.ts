import customerFlow from "./customers";
import { paymentFlow } from "./payments";

export default async function processPayment(
  name: string,
  cpfCnpj: string,
  paymentType: "PIX" | "CREDIT_CARD",
  amount: number,
  redirectUrl?: string
) {
  const customerId = await customerFlow(name, cpfCnpj);

  const paymentData = await paymentFlow(
    customerId,
    paymentType,
    amount,
    "Teste",
    redirectUrl
  );
  return paymentData;
}
