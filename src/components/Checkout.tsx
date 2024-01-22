"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { presents } from "../constants";

export default function Checkout(props: {
  onRemovePresent: (index: number) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout")?.split(",").map(Number);

  function handleConfirm() {
    router.push("/");
  }

  function onRemovePresent(presentIndex: number) {
    const newCheckout = checkout?.filter((index) => index !== presentIndex);
    props.onRemovePresent(presentIndex);
    if (newCheckout?.length === 0) return router.push("/");

    router.push(`?checkout=${newCheckout?.join(",")}`);
  }

  return (
    <div className="flex justify-center items-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-40 z-10 overflow-hidden">
      <div className="flex flex-col justify-between w-6/12 min-w-96 max-w-2xl h-96 bg-blue-100">
        <div className="flex w-full h-full justify-between flex-col items-stretch">
          <div className="flex flex-col justify-center items-center w-full h-full">
            {checkout?.map((presentIndex) => (
              <div key={presents[presentIndex].title}>
                <h1 className="text-3xl text-white">
                  {presents[presentIndex].title}
                </h1>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemovePresent(presentIndex);
                  }}
                >
                  Remover presente
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between items-start w-full cursor-pointer">
            <Link href="/">Adicionar mais itens</Link>
            <button
              type="submit"
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleConfirm();
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
