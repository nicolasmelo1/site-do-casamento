"use client";

import { Fragment } from "react";

import sections from "../constants/sections";

import type { getPendingPayment } from "../server/asaas/payments";

export default function Section(props: {
  cookies: string;
  hasConfirmedOrNotPresence: boolean | undefined;
  isDevMode: boolean;
  paymentData: Awaited<ReturnType<typeof getPendingPayment>>;
}) {
  return sections.map((section, i) => {
    return (
      <Fragment key={section.slug}>
        {section?.breakpoints?.beforeContainer !== undefined
          ? section.breakpoints.beforeContainer
          : null}
        <div
          key={section.slug}
          className={`flex justify-center items-start w-full ${
            section.doNotShowHeader ? "" : "p-6 lg:pt-3 lg:pb-3 lg:pl-3 lg:pr-3"
          } bg-white${
            section.isSticky
              ? " sticky top-0 overflow-scroll scroll-smooth min-h-screen"
              : ""
          }`}
          style={{
            zIndex: typeof section.zIndex === "number" ? section.zIndex : i + 1,
          }}
        >
          <div
            className={`flex flex-col justify-center items-center ${
              typeof section.content === "string" ? " min-w-96 max-w-lg" : ""
            }`}
          >
            {section?.breakpoints?.beforeTitle !== undefined
              ? section.breakpoints.beforeTitle
              : null}
            <h1
              id={section.slug}
              className={`flex w-full justify-center text-4xl font font-italianno${
                section?.breakpoints?.betweenContentAndTitle !== undefined
                  ? " pb-6"
                  : ""
              }${section.doNotShowHeader ? " hidden" : ""}`}
            >
              {section.label}
            </h1>
            {section?.breakpoints?.betweenContentAndTitle !== undefined
              ? section.breakpoints.betweenContentAndTitle
              : null}
            {typeof section.content === "string"
              ? section.content.split("\n").map((paragraph) => (
                  <p
                    key={paragraph}
                    className="flex w-full justify-center text-justify text-2xlr pt-6"
                  >
                    {paragraph}
                  </p>
                ))
              : typeof section.content === "function"
              ? section.content(props)
              : section.content}
            {section?.breakpoints?.afterContent !== undefined
              ? section.breakpoints.afterContent
              : null}
          </div>
        </div>
        {section?.breakpoints?.afterContainer !== undefined
          ? section.breakpoints.afterContainer
          : null}
      </Fragment>
    );
  });
}
