"use client";

import Link from "next/link";
import { presents } from "../../constants";

import { Fragment } from "react";

export default function Summary(props: {
  cookies: string;
  checkout: number[];
  onRemovePresent: (index: number) => void;
  onGoToAccount: () => void;
}) {
  return (
    <Fragment>
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
    </Fragment>
  );
}
