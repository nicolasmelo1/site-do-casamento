import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  COOKIES_BILLING_CURRENT_PAYMENT_ID,
  CHECKOUT_PAYMENT_QUERY_PARAM,
  specialPersons,
  CHECKOUT_REMOVE_PAYMENT,
} from "../constants";
import Presents from "../components/Presents";
import {
  getPaymentDataFromPaymentId,
  getPendingPayment,
} from "../server/asaas/payments";

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
  searchParams: { payment?: string };
}) {
  const paymentData = await getPaymentData(props.searchParams);

  return (
    <main className="flex flex-col overflow-scroll w-full">
      <div className="flex flex-col justify-center items-center">
        <h1 className="flex w-full justify-center text-2xlr">
          Nicolas e Viviane
        </h1>
        <div className="flex w-full relative h-96">
          <Image
            fill={true}
            src="/placeholder.webp"
            sizes="100vw 50vh"
            objectFit="cover"
            alt="Picture of the author"
            className="w-full h-auto"
          />
          L
        </div>
      </div>
      <div className="flex justify-center items-center w-full p-6">
        <div className="flex flex-col justify-center items-center min-w-96 max-w-lg">
          <h1 className="flex w-full justify-center text-4xl">O Casal</h1>
          <p className="flex w-full justify-center text-2xlr">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            aliquam, mi at ultricies imperdiet, nisl ipsum vehicula eros, et
            aliquam nisl quam eget nunc. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full mt-4">
        <div
          className="flex w-full bg-attachment bg-fixed relative h-96 bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(/placeholder.webp)` }}
        />
      </div>
      <div className="flex justify-center items-center w-full mt-4">
        <div
          className="flex w-full bg-attachment bg-fixed relative h-96 bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(/placeholder.webp)` }}
        />
      </div>
      <div className="flex justify-center items-center w-full p-6">
        <div className="flex flex-col justify-center items-center min-w-96 max-w-lg">
          <h1 className="flex w-full justify-center text-4xl">O Casal</h1>
          <div className="flex relative h-96 w-96">
            <Image
              fill={true}
              src="/placeholder.webp"
              sizes="100vw 50vh"
              objectFit="cover"
              alt="Picture of the author"
              className="w-full h-auto"
            />
          </div>
          <p className="flex w-full justify-center text-2xlr pt-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            aliquam, mi at ultricies imperdiet, nisl ipsum vehicula eros, et
            aliquam nisl quam eget nunc. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full p-6">
        <div className="flex flex-col justify-center items-center min-w-96 max-w-lg">
          <h1 className="flex w-full justify-center text-4xl">O Casal</h1>
          <div className="flex relative h-96 w-96">
            <Image
              fill={true}
              src="/placeholder.webp"
              sizes="100vw 50vh"
              objectFit="cover"
              alt="Picture of the author"
              className="w-full h-auto"
            />
          </div>
          <p className="flex w-full justify-center text-2xlr pt-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            aliquam, mi at ultricies imperdiet, nisl ipsum vehicula eros, et
            aliquam nisl quam eget nunc. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi.
          </p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center items-center w-full p-6">
        <div className="p-6">
          <Image
            src="/placeholder.webp"
            alt="Picture of the author"
            width={384}
            height={384}
          />
        </div>
        <div className="p-6">
          <Image
            src="/placeholder.webp"
            alt="Picture of the author"
            width={384}
            height={384}
          />
        </div>
        <div className="p-6">
          <Image
            src="/placeholder.webp"
            alt="Picture of the author"
            width={384}
            height={384}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center items-center w-full p-6">
        <div className="flex flex-row flex-wrap justify-center items-center w-screen max-w-6xl">
          {specialPersons.map((specialPerson) => (
            <div
              key={specialPerson.name}
              className="flex justify-center flex-wrap p-6 w-3/12 min-w-72"
            >
              <p>{specialPerson.name}</p>
              <Image
                src={specialPerson.photo}
                alt="Picture of the author"
                width={384}
                height={384}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center w-full p-6">
        <div className="flex flex-col justify-center items-center min-w-96 max-w-lg">
          <h1 className="flex w-full justify-center text-4xl">O Casal</h1>
          <p className="flex w-full justify-center text-2xlr pt-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            aliquam, mi at ultricies imperdiet, nisl ipsum vehicula eros, et
            aliquam nisl quam eget nunc. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi. Nulla facilisi. Donec ut quam sed
            lectus aliquet suscipit. Donec vel semper massa. Sed ut semper
            mauris. Nullam in aliquet felis. Nullam sed semper odio. Sed
            ultricies, nisl eget ultricies fermentum, nulla neque aliquam
            tortor, vitae tincidunt sapien nunc vel magna. Donec sed dolor
            tincidunt, aliquet leo in, lacinia velit. Nam ultrices, leo sit amet
            auctor elementum, nisl orci ultrices quam, nec imperdiet quam nunc
            vitae tortor. Aliquam erat volutpat. Fusce sed ligula vitae nunc
            dignissim lacinia. Nulla facilisi.
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center w-full p-6">
        <iframe
          width="600"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen={true}
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyANcu9m5u73d9IwIHVBTctJDN6aTkxloPo&q=Villa+Vezzane,Mairiporã+SP"
        ></iframe>
      </div>
      <Presents cookies={cookies().toString()} paymentData={paymentData} />
    </main>
  );
}
