import Image from "next/image";
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
    diffInMonthsFromToday <= 3 &&
    diffInMonthsFromToday >= 0 &&
    searchParams?.going !== CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE;

  if (shouldRedirectToConfirmationPage) {
    const newUrlSearchParams = new URLSearchParams([
      [
        CONFIRMATION_CONFIRMATION_QUERY_PARAM,
        CONFIRMATION_CONFIRMATION_QUERY_PARAM_VALUE,
      ],
    ]);
    redirect(`?${newUrlSearchParams.toString()}`);
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

export default async function Home(props: {
  searchParams: { payment?: string; going?: string };
}) {
  const [paymentData, hasConfirmedPresenceOrNot] = await Promise.all([
    getPaymentData(props.searchParams),
    hasConfirmedOrNotPresence(props.searchParams),
  ]);

  return (
    <main className="flex flex-col overflow-scroll w-full">
      <Navigation sections={sections} />
      {/*<div className="flex flex-col justify-center items-center">
        <div className="flex w-full relative h-96">
          <Image
            fill={true}
            src="/primeira-foto-2.png"
            sizes="100vw 50vh"
            objectFit="cover"
            alt="Picture of the author"
            className="w-full h-auto"
          />
        </div>
  </div>*/}
      <Section
        hasConfirmedOrNotPresence={hasConfirmedPresenceOrNot}
        paymentData={paymentData}
        cookies={cookies().toString()}
      />
      <footer
        className="flex justify-center items-center w-full p-6"
        style={{ zIndex: 100 }}
      >
        Feito com ❤️ por <span className="font-bold ml-1 mr-1">Nicolas</span> e
        <span className="font-bold ml-1 mr-1">Viviane</span> (principalmente ele
        😂)
      </footer>
    </main>
  );
}
