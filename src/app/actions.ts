"use server";

import { headers } from "next/headers";
import processPayment from "../server/asaas";
import { cancelPaymentFlow } from "../server/asaas/payments";
import { db } from "../lib";
import createOrUpdateGuest from "../server/create-or-update-guest";

export async function handlePayment(
  name: string,
  cpfCnpj: string,
  paymentType: "PIX" | "CREDIT_CARD",
  message: string | undefined,
  amount: number
) {
  const origin = headers().get("origin");

  // Create a nice message to us when the user makes a payment, we can remove duplicates but i don't really care about that here. Why should i care?
  const shouldAppendMessageToUser =
    typeof message === "string" && message.length > 0;
  if (shouldAppendMessageToUser) {
    const existingGuestId = await createOrUpdateGuest(
      name,
      cpfCnpj,
      undefined,
      undefined
    );
    if (existingGuestId !== undefined) {
      await db
        .insertInto("guests_presents")
        .values({
          guestId: existingGuestId,
          message,
        })
        .execute();
    }
  }

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

export async function confirmPresence(
  name: string,
  cpfCnpj: string,
  phone: string | undefined,
  isGoing: boolean | undefined = true
) {
  return createOrUpdateGuest(name, cpfCnpj, phone, isGoing);
}
