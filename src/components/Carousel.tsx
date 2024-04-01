"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks";

export default function Carousel(props: {
  images: { src: string; alt: string }[];
}) {
  const scrollRef = useRef<HTMLDivElement | undefined>(undefined);
  const [width, setWidth] = useState<number>(0);
  const isOnServer = typeof window === "undefined";
  const debounce = useDebounce(30);

  function onScroll(addOrSubtract: "add" | "subtract") {
    const index = Math.round((scrollRef.current?.scrollLeft || 0) / width);
    if (addOrSubtract === "add" && index < props.images.length - 1) {
      scrollRef.current!.scrollLeft = width * (index + 1);
    } else if (addOrSubtract === "subtract" && index > 0) {
      scrollRef.current!.scrollLeft = width * (index - 1);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setWidth(document.body.offsetWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setWidth(document.body.offsetWidth);
  }, [isOnServer]);

  return (
    <section className="flex h-96 items-center w-full lg:w-[90vw] relative bg-transparent">
      <button
        type={"button"}
        title={"Previous"}
        className="flex items-center justify-center pl-2 pr-2 absolute left-0 top-0 bottom-0 z-20"
        onClick={(e) => {
          e.preventDefault();
          onScroll("subtract");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 stroke-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div
        className="flex flex-row overflow-x-scroll scroll-smooth scrollbar-hide"
        ref={(ref) => {
          (scrollRef as any).current = ref;
          if (ref?.offsetWidth) setWidth(ref?.offsetWidth);
        }}
        onScroll={(e) => {
          e.preventDefault();
          let currentTarget = e.currentTarget;

          debounce(() => {
            for (let i = 0; i < props.images.length; i++) {
              if (currentTarget.scrollLeft <= width * i) {
                if (currentTarget.scrollLeft <= width * i - width / 2)
                  currentTarget.scrollLeft = width * i - width;
                else currentTarget.scrollLeft = width * i;
                break;
              }
            }
          });
        }}
      >
        {props.images.map((image) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minWidth: `${width}px`,
              height: "384px",
            }}
            key={image.src}
          >
            <div className="flex items-center max-w-96 w-full h-full relative">
              <Image
                src={image.src}
                objectFit="cover"
                alt={image.alt}
                fill={true}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type={"button"}
        title={"Next"}
        className="flex items-center justify-center pl-2 pr-2 absolute right-0 top-0 bottom-0 z-20"
        onClick={(e) => {
          e.preventDefault();
          onScroll("add");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 stroke-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}
