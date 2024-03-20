"use client";

import { useEffect, useState } from "react";

import { setLayoutTimeout, clearLayoutTimeout } from "../utils";
import { WEDDING_DATE } from "../constants";

export default function Countdown() {
  const [now, setNow] = useState(new Date());

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

  return (
    <div className="flex flex-row justify-center items-center w-full cursor-pointer mt-6 md:mt-2">
      <div className="flex flex-row justify-center items-center md:w-full flex-wrap">
        <div className="flex flex-col justify-center items-center w-36 bg-red-400 rounded-md p-3 mr-3 md:mr-2 md:m-2">
          <p className="text-white text-2xl">
            {`${Math.floor(
              (WEDDING_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )}`}
          </p>
          <p className="text-white text-sm">
            {Math.floor(
              (WEDDING_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ) === 1
              ? "Dia"
              : "Dias"}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-36 bg-red-400 rounded-md p-3 mr-3 md:mr-2 md:m-2">
          <p className="text-white text-2xl">
            {`${Math.floor(
              (WEDDING_DATE.getTime() - now.getTime()) / (1000 * 60 * 60)
            )}`}
          </p>
          <p className="text-white text-sm">
            {Math.floor(
              (WEDDING_DATE.getTime() - now.getTime()) / (1000 * 60 * 60)
            ) === 1
              ? "Minuto"
              : "Minutos"}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-36 bg-red-400 rounded-md p-3 mr-3 md:mr-2 md:m-2">
          <p className="text-white text-2xl">
            {`${Math.floor(
              (WEDDING_DATE.getTime() - now.getTime()) / (1000 * 60)
            )}`}
          </p>
          <p className="text-white text-sm">
            {Math.floor(
              (WEDDING_DATE.getTime() - now.getTime()) / (1000 * 60)
            ) === 1
              ? "Hora"
              : "Horas"}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-36 bg-red-400 rounded-md p-3 md:m-2">
          <p className="text-white text-2xl">
            {`${Math.floor((WEDDING_DATE.getTime() - now.getTime()) / 1000)}`}
          </p>
          <p className="text-white text-sm">
            {Math.floor((WEDDING_DATE.getTime() - now.getTime()) / 1000) === 1
              ? "Segundo"
              : "Segundos"}
          </p>
        </div>
      </div>
    </div>
  );
}
