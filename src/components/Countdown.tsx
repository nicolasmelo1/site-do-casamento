"use client";

import { useEffect, useState } from "react";

import { setLayoutTimeout, clearLayoutTimeout } from "../utils";
import { WEDDING_DATE } from "../constants";

export default function Countdown() {
  const [now, setNow] = useState(new Date());
  const [dimension, setDimension] = useState<
    "days" | "hours" | "minutes" | "seconds"
  >("days");

  function onSwitchDimension() {
    setDimension((dimension) => {
      switch (dimension) {
        case "days":
          return "hours";
        case "hours":
          return "minutes";
        case "minutes":
          return "seconds";
        case "seconds":
          return "days";
      }
    });
  }

  useEffect(() => {
    const timeout = setLayoutTimeout(() => {
      const timeLeft = WEDDING_DATE.getTime() - Date.now();
      if (timeLeft <= 0) setNow(WEDDING_DATE);
      else setNow(new Date());
    }, 1000);

    return () => {
      clearLayoutTimeout(timeout);
    };
  }, [now]);

  useEffect(() => {
    const interval = setInterval(() => {
      onSwitchDimension();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [dimension]);

  return (
    <button
      type="button"
      className="flex flex-row justify-center items-center w-full cursor-pointer mt-6"
      onClick={(e) => {
        e.preventDefault();
        onSwitchDimension();
      }}
    >
      <div className="flex flex-col justify-center items-center w-52 bg-red-400 rounded-md p-6">
        <p className="text-white text-2xl">
          {`${Math.floor(
            (WEDDING_DATE.getTime() - now.getTime()) /
              (dimension === "days"
                ? 1000 * 60 * 60 * 24
                : dimension === "hours"
                ? 1000 * 60 * 60
                : dimension === "minutes"
                ? 1000 * 60
                : 1000)
          )}`}
        </p>
        <p className="text-white text-sm">
          {dimension === "days"
            ? "Dias"
            : dimension === "hours"
            ? "Horas"
            : dimension === "minutes"
            ? "Minutos"
            : "Segundos"}
        </p>
      </div>
    </button>
  );
}
