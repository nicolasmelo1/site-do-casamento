"use client";

import Link from "next/link";
import { presents } from "../../constants";

export default function Summary(props: {
  cookies: string;
  checkout: number[];
  onRemovePresent: (index: number) => void;
  onGoToAccount: () => void;
}) {
  return (
    <div className="flex flex-col justify-between w-6/12 min-w-96 max-w-2xl h-96 bg-blue-100">
      <div className="flex w-full h-full justify-between flex-col items-stretch">
        <div className="flex flex-col justify-center items-center w-full h-full">
          {props.checkout?.map((presentIndex) => (
            <div key={presents[presentIndex].title}>
              <h1 className="text-3xl text-white">
                {presents[presentIndex].title}
              </h1>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  props.onRemovePresent(presentIndex);
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
              props.onGoToAccount();
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
