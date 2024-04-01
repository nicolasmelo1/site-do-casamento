"use client";

import Link from "next/link";
import { getPresents, strings } from "../../constants";

import { Fragment } from "react";
import Image from "next/image";
import { displayValueInCurrency } from "../../utils";

export default function Summary(props: {
  cookies: string;
  isDevMode: boolean;
  checkout: number[];
  onRemovePresent: (index: number) => void;
  onGoToAccount: () => void;
}) {
  return (
    <Fragment>
      <div className="flex w-full h-full justify-between flex-col items-stretch">
        <div className="flex flex-col justify-between items-center w-full h-full">
          <div className="flex flex-row items-start w-full">
            <h1 className="text-xl">Sumário</h1>
          </div>
          <div className="flex flex-col w-full overflow-auto p-2 h-full mt-3 mb-3">
            {props.checkout?.map((presentIndex, index) => (
              <div
                className="flex flex-col w-full items-center justify-start select-none"
                key={getPresents(props.isDevMode)[presentIndex].title}
              >
                <div className="flex flex-row items-center justify-between w-full">
                  <div className="flex flex-row items-center">
                    <div className="relative w-16 h-16 pl-3 pr-3">
                      <Image
                        src={
                          getPresents(props.isDevMode)[presentIndex].imageUrl
                        }
                        alt={getPresents(props.isDevMode)[presentIndex].title}
                        fill={true}
                        className="object-cover rounded-2xl"
                      />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-base text-gray-800 pl-3">
                        {getPresents(props.isDevMode)[presentIndex].title}
                      </h1>
                      <p className="text-gray-500 pl-3">
                        {displayValueInCurrency(
                          getPresents(props.isDevMode)[presentIndex].value
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    className="flex flex-row items-center justify-center border-black border-2 p-2 rounded-xl hover:bg-gray-300 ml-3"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      props.onRemovePresent(presentIndex);
                    }}
                  >
                    Remover
                  </button>
                </div>
                {index < props.checkout.length - 1 ? (
                  <div className="mt-3 mb-3 w-9/12 h-[2px] bg-gray-500" />
                ) : null}
              </div>
            ))}
          </div>
          <div className="flex md:flex-col md:w-full flex-row justify-between items-center w-full">
            <Link
              href="/"
              className="md:w-full cursor-pointer text-gray-800 text-bold pt-2 pb-2 pr-4 pl-4 rounded-xl font-semibold border-gray-800 border-2 w-1/3 text-center hover:bg-gray-300"
            >
              {strings.checkoutSummaryGoBackButton}
            </Link>
            <button
              type="submit"
              className="md:w-full md:mt-3 cursor-pointer bg-gray-800 text-white font-semibold pt-2 pb-2 pr-4 pl-4 rounded-xl w-1/3 h-full hover:bg-gray-500"
              onClick={(e) => {
                e.preventDefault();
                props.onGoToAccount();
              }}
            >
              {strings.checkoutSummaryGoToAccountButton}
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
