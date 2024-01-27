import { Fragment } from "react";
import Image from "next/image";

import type { getPendingPayment } from "../../server/asaas/payments";

export default function Payment(props: {
  onCancel: () => void;
  onDismiss: () => void;
  isNewPayment: boolean;
  paymentData: Awaited<ReturnType<typeof getPendingPayment>>;
}) {
  return (
    <Fragment>
      <div className="flex flex-col justify-center items-center h-full">
        {props.paymentData?.isPendingOnNewPayment === true ? (
          <p className="text-center">
            Ficamos lisongeados, mas vc tem outro pagamento em aberto.
          </p>
        ) : props.isNewPayment === false ? (
          <p className="text-center">
            Você tem um pagamento pendente, por favor, pague-o ou cancele.
          </p>
        ) : null}

        {/* <iframe title={"payment slip"} src={props.paymentData?.invoiceUrl} /> */}
        {/* <Image
          src={`data:image/png;base64, ${props.paymentData?.pix.base64Encoded}`}
          alt="QR Code"
          width={150}
          height={256}
        />*/}
        {props.paymentData?.billingType === "PIX" ? (
          <a
            href={props.paymentData.invoiceUrl}
            className="flex flex-row w-full justify-between items-center pt-2 pb-2 pr-6 pl-6 border-black border-2 rounded-md"
            target="_blank"
          >
            <p className="text-center text-2xl">{"Pix"}</p>
            <p>Abrir</p>
          </a>
        ) : props.paymentData?.billingType === "CREDIT_CARD" ? (
          <a
            href={props.paymentData.invoiceUrl}
            className="flex flex-row w-full justify-between items-center pt-2 pb-2 pr-6 pl-6 border-black border-2 rounded-md"
            target="_blank"
          >
            <p className="text-center text-2xl">{"Cartão de Crédito"}</p>
            <p>Abrir</p>
          </a>
        ) : null}
        {props.paymentData?.paymentId &&
        props.paymentData?.paymentId.length > 0 ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              props.onCancel();
            }}
          >
            Cancelar
          </button>
        ) : null}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            props.onDismiss();
          }}
        >
          Fechar
        </button>
      </div>
    </Fragment>
  );
}
