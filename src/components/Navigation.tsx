"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Fragment } from "react";
import {
  NAVIGATION_MENU_QUERY_PARAM,
  NAVIGATION_MENU_QUERY_PARAM_VALUE,
  strings,
} from "../constants";

export default function Navigation(props: {
  sections: { label: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isMenuOpen =
    searchParams.get(NAVIGATION_MENU_QUERY_PARAM) ===
    NAVIGATION_MENU_QUERY_PARAM_VALUE;

  return (
    <Fragment>
      <nav className="flex flex-row justify-between items-center p-6">
        <h1 className="font-thankYou text-gray-400 text-2xl">
          {strings.title}
        </h1>
        <button
          aria-label="Menu"
          className="flex w-6 h-4 justify-between flex-col"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (isMenuOpen) router.push("/");
            else {
              const searchParams = new URLSearchParams([
                [
                  NAVIGATION_MENU_QUERY_PARAM,
                  NAVIGATION_MENU_QUERY_PARAM_VALUE,
                ],
              ]);
              router.push(`?${searchParams.toString()}`);
            }
          }}
        >
          <div className="bg-gray-400 h-[2px] w-full" />
          <div className="bg-gray-400 h-[2px] w-full" />
          <div className="bg-gray-400 h-[2px] w-full" />
        </button>
      </nav>
      <div
        className={`flex w-full flex-col transition-[height] duration-300 ease-in-out ${
          isMenuOpen ? `h-[50vh]` : "h-0"
        }`}
      >
        {props.sections.map((section, i) => (
          <Fragment key={section.slug}>
            <button
              type="button"
              className={`pt-2 pb-2${
                i < props.sections.length ? " border-t-2 border-gray-200" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                // First close the modal then scroll to the section
                router.push("/");
                setTimeout(() => {
                  router.push(`/#${section.slug}`);
                }, 500);
              }}
            >
              {section.label}
            </button>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
}
