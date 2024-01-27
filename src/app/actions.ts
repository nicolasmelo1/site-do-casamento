"use server";

import { headers } from "next/headers";
import processPayment from "../server/asaas";
import { cancelPaymentFlow } from "../server/asaas/payments";
import { redirect } from "next/dist/server/api-utils";

export async function handlePayment(
  name: string,
  cpfCnpj: string,
  paymentType: "PIX" | "CREDIT_CARD",
  amount: number
) {
  const origin = headers().get("origin");
  return processPayment(
    name,
    cpfCnpj,
    paymentType,
    amount,
    origin || undefined
  );
}

export async function cancelPayment(paymentId: string) {
  await cancelPaymentFlow(paymentId);
}
