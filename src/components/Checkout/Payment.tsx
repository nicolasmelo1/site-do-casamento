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
        <Image
          src={`data:image/png;base64, ${props.paymentData?.pix.base64Encoded}`}
          alt="QR Code"
          width={150}
          height={256}
        />
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
