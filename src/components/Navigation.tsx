"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Fragment } from "react";
import {
  NAVIGATION_MENU_QUERY_PARAM,
  NAVIGATION_MENU_QUERY_PARAM_VALUE,
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
      <nav className="md:hidden flex items-start justify-between p-6 none">
        <h1>Nicolas & Viviane</h1>
        <div className="flex flex-row">
          {props.sections.map((section) => (
            <button
              key={section.slug}
              type="button"
              className="pl-3 pr-3 hover:text-red-400"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/#${section.slug}`);
              }}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>
      <nav className="md:flex hidden flex-row justify-between items-center p-6">
        <h1>Nicolas & Viviane</h1>
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
          <div className="bg-red-400 h-[2px] w-full" />
          <div className="bg-red-400 h-[2px] w-full" />
          <div className="bg-red-400 h-[2px] w-full" />
        </button>
      </nav>
      <div
        className={`flex w-full flex-col transition-[height] duration-300 ease-in-out ${
          isMenuOpen ? `h-[50vh]` : "h-0"
        }`}
      >
        {props.sections.map((section) => (
          <button
            key={section.slug}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/#${section.slug}`);
            }}
          >
            {section.label}
          </button>
        ))}
      </div>
    </Fragment>
  );
}
