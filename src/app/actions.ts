"use server";

import processPayment from "../server/asaas";

export async function handlePayment(
  name: string,
  cpfCnpj: string,
  amount: number
) {
  return processPayment(name, cpfCnpj, amount);
}
