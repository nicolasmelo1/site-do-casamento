"use client";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";

import { presents } from "../constants";
import Checkout from "./Checkout";
import { useLocalStorageState } from "../hooks";

export default function Presents(props: { checkout: string | undefined }) {
  const router = useRouter();
  const [presentsIndexes, setPresentIndexes] = useLocalStorageState(
    "presentIndexes",
    [] as number[]
  );

  return (
    <Fragment>
      {presents.map((present, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.preventDefault();
            const newPresentIndexes = Array.from(
              new Set([...presentsIndexes, index])
            );
            setPresentIndexes(newPresentIndexes);
            router.push(`?checkout=${newPresentIndexes.join(",")}`);
          }}
        >
          {present.title}
        </button>
      ))}
      {props.checkout ? (
        <Checkout
          onRemovePresent={(presentIndex) =>
            setPresentIndexes(
              presentsIndexes?.filter((index) => index !== presentIndex)
            )
          }
        />
      ) : null}
    </Fragment>
  );
}
