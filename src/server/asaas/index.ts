import customerFlow from "./customers";
import { paymentFlow } from "./payments";

export default async function processPayment(
  name: string,
  cpfCnpj: string,
  amount: number
) {
  const customerId = await customerFlow(name, cpfCnpj);

  const paymentData = await paymentFlow(customerId, "PIX", amount, "Teste");
  return paymentData;
}
