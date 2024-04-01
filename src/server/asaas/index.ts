import customerFlow from "./customers";
import { paymentFlow } from "./payments";

export default async function processPayment(
  name: string,
  cpfCnpj: string,
  paymentType: "PIX" | "CREDIT_CARD",
  amount: number,
  redirectUrl?: string
) {
  console.log("aqui1", name, cpfCnpj, paymentType, amount, redirectUrl);
  const customerId = await customerFlow(name, cpfCnpj);

  console.log("aqui", customerId);
  const paymentData = await paymentFlow(
    customerId,
    paymentType,
    amount,
    "Teste",
    redirectUrl
  );
  console.log("aqui3", paymentData);

  return paymentData;
}
