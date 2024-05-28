import { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  COOKIES_BILLING_CURRENT_PAYMENT_ID,
  CHECKOUT_PAYMENT_QUERY_PARAM,
  sections,
  CHECKOUT_REMOVE_PAYMENT,
  COOKIES_CPF_CNPJ,
  WEDDING_DATE,
  CONFIRMATION_CONFIRMATION_QUERY_PARAM,
  CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE,
  COOKIES_PHONE,
} from "../constants";
import {
  getPaymentDataFromPaymentId,
  getPendingPayment,
} from "../server/asaas/payments";
import { getGuest } from "../server";
import Navigation from "../components/Navigation";
import Section from "../components/Section";

import type { Metadata } from "next";

/**
 * Get the difference of two dates in months
 *
 * @param dateFrom - The start (smaller) date.
 * @param dateTo - The end (bigger) date.
 */
function monthDiff(dateFrom: Date, dateTo: Date) {
  return (
    dateTo.getMonth() -
    dateFrom.getMonth() +
    12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
}

/**
 * Checks from the cookies if the user is going to the wedding.
 *
 * @param searchParams - Next search params object
 *
 * @returns - Returns boolean if the user has already set confirmation, false otherwise.
 */
async function hasConfirmedOrNotPresence(searchParams: {
  going?: string;
}): Promise<boolean | undefined> {
  const today = new Date();
  const cookiesInitialized = cookies();
  const cpfCnpj = cookiesInitialized.get(COOKIES_CPF_CNPJ);
  const phone = cookiesInitialized.get(COOKIES_PHONE);

  const guestData = await getGuest(
    cpfCnpj?.value as string,
    phone?.value as string
  );

  const diffInMonthsFromToday = monthDiff(today, WEDDING_DATE);
  const shouldRedirectToConfirmationPage =
    typeof guestData?.isGoing !== "boolean" &&
    diffInMonthsFromToday < 3 &&
    diffInMonthsFromToday >= 0 &&
    searchParams?.going !== CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE;

  if (shouldRedirectToConfirmationPage) {
    const newUrlSearchParams = new URLSearchParams([
      [
        CONFIRMATION_CONFIRMATION_QUERY_PARAM,
        CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE,
      ],
    ]);
    //redirect(`?${newUrlSearchParams.toString()}`);
    return;
  }

  if (cpfCnpj?.value || phone?.value) {
    const guestData = await getGuest(
      cpfCnpj?.value.replace(/^"/g, "").replace(/"$/g, "") as string,
      phone?.value.replace(/^"/g, "").replace(/"$/g, "") as string
    );
    return typeof guestData?.isGoing === "boolean"
      ? guestData?.isGoing
      : undefined;
  } else return undefined;
}

async function getPaymentData(searchParams: { payment?: string }) {
  const cookiesInitialized = cookies();
  let paymentData = await getPendingPayment(
    cookiesInitialized
      .get(COOKIES_BILLING_CURRENT_PAYMENT_ID)
      ?.value.replace(/^"/g, "")
      .replace(/"$/g, "")
  );
  const dismissPayment = cookiesInitialized.get(CHECKOUT_REMOVE_PAYMENT);

  const hasPendingPaymentAndPageIsNotPaymentPage =
    typeof paymentData === "object" &&
    paymentData !== undefined &&
    searchParams?.payment !== paymentData?.paymentId &&
    dismissPayment === undefined;

  if (hasPendingPaymentAndPageIsNotPaymentPage) {
    const newUrlSearchParams = new URLSearchParams([
      [CHECKOUT_PAYMENT_QUERY_PARAM, paymentData?.paymentId as string],
    ]);
    redirect(`?${newUrlSearchParams.toString()}`);
  }

  const isPaymentPageAndDoesNotHavePendingPayment =
    paymentData === undefined && searchParams?.payment !== undefined;
  if (isPaymentPageAndDoesNotHavePendingPayment)
    paymentData = await getPaymentDataFromPaymentId(
      searchParams.payment as string
    );

  return paymentData;
}

async function isDevMode(searchParams: { dev?: string }) {
  return typeof searchParams?.dev === "string" && searchParams?.dev === "true";
}

type Props = PropsWithChildren<{
  searchParams: any;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    payment?: string;
    going?: string;
    dev?: string;
    inviteName?: string;
  };
}): Promise<Metadata> {
  return {
    title: searchParams?.inviteName
      ? `Um convite de Nicolas e Viviane para ${searchParams?.inviteName}`
      : "Nicolas Melo & Viviane Gennari (Melo)",
    description: searchParams?.inviteName
      ? `${searchParams?.inviteName}, com muito amor nós convidamos você${
          searchParams?.inviteName.split(" ").length > 1 ? "s" : ""
        } para celebrar conosco o nosso casamento no dia 28/07/2024 as 15:30 no Espaço Villa Vezzane em Mairiporã - SP`
      : "Convidamos você para celebrar conosco o nosso casamento no dia 28/07/2024 as 15:30 no Espaço Villa Vezzane em Mairiporã - SP",
    metadataBase: new URL(
      `${
        process.env.VERCEL_URL
          ? process.env.VERCEL_URL
          : `http://localhost:${process.env.PORT || 3000}}`
      }`
    ),
    openGraph: {
      images: [
        {
          url:
            Math.random() > 0.7
              ? "/nos-1.jpeg"
              : Math.random() > 0.5
              ? "/capa.jpeg"
              : "/nos-2.jpeg",
          width: 300,
          height: 300,
        },
      ],
    },
  };
}

export default async function Home(props: {
  searchParams: { payment?: string; going?: string; dev?: string };
}) {
  const [paymentData, hasConfirmedPresenceOrNot, isDevelopment] =
    await Promise.all([
      getPaymentData(props.searchParams),
      hasConfirmedOrNotPresence(props.searchParams),
      isDevMode(props.searchParams),
    ]);

  return (
    <main className="flex flex-col overflow-scroll scroll-smooth w-full">
      <Navigation sections={sections} />
      <Section
        isDevMode={isDevelopment}
        hasConfirmedOrNotPresence={hasConfirmedPresenceOrNot}
        paymentData={paymentData}
        cookies={cookies().toString()}
      />
      <footer className="flex justify-center items-center w-full p-6 bg-white flex-wrap">
        Feito com ❤️ por <span className="font-bold ml-1 mr-1">Nicolas</span> e
        <span className="font-bold ml-1 mr-1">Viviane</span> (principalmente ele
        e ela mandando 😂)
      </footer>
    </main>
  );
}
