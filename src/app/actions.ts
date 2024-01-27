"use server";

import processPayment from "../server/asaas";
import { cancelPaymentFlow } from "../server/asaas/payments";

export async function handlePayment(
  name: string,
  cpfCnpj: string,
  amount: number
) {
  return processPayment(name, cpfCnpj, amount);
}

export async function cancelPayment(paymentId: string) {
  await cancelPaymentFlow(paymentId);
}
