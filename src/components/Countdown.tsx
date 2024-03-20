"use client";

import { Fragment, useEffect, useState } from "react";

import { setLayoutTimeout, clearLayoutTimeout } from "../utils";
import { WEDDING_DATE } from "../constants";

export default function Countdown() {
  const weddingDay = new Date(
    WEDDING_DATE.getFullYear(),
    WEDDING_DATE.getMonth(),
    WEDDING_DATE.getDate(),
    0,
    0,
    0,
    0
  );
  const [now, setNow] = useState(new Date());
  const differenceInMillis = weddingDay.getTime() - now.getTime();
  const differenceInDays =
    differenceInMillis <= 0 ? 0 : differenceInMillis / (1000 * 60 * 60 * 24);
  const isToday = differenceInDays === 0;

  const differenceInHoursIfToday = WEDDING_DATE.getHours() - now.getHours();
  const differenceInHours = isToday
    ? differenceInHoursIfToday <= 0
      ? 0
      : differenceInHoursIfToday
    : 24 - now.getHours();

  const differenceInMinutesIfToday =
    WEDDING_DATE.getMinutes() - now.getMinutes();
  const differenceInMinutes =
    isToday && differenceInHours === 0
      ? differenceInMinutesIfToday <= 0
        ? 0
        : differenceInMinutesIfToday
      : 60 - now.getMinutes();

  const differenceInSecondsIfToday =
    WEDDING_DATE.getSeconds() - now.getSeconds();
  const differenceInSeconds =
    isToday && differenceInHours === 0 && differenceInMinutes === 0
      ? differenceInSecondsIfToday <= 0
        ? 0
        : differenceInSecondsIfToday
      : 60 - now.getSeconds();

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
        <div className="flex flex-col justify-center items-center w-24 h-24 bg-red-400 rounded-md p-3 mr-3 md:mr-2 md:m-2">
          {Math.round(differenceInDays) <= 0 ? (
            <p className="text-white text-sm text-center">{`É hoje!`}</p>
          ) : (
            <Fragment>
              <p className="text-white text-2xl">
                {`${Math.floor(differenceInDays)}`}
              </p>
              <p className="text-white text-sm">
                {Math.floor(differenceInDays) === 1 ? "Dia" : "Dias"}
              </p>
            </Fragment>
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-24 h-24 bg-red-400 rounded-md p-3 mr-3 md:mr-2 md:m-2">
          {Math.round(differenceInHours) <= 0 ? (
            <p className="text-white text-sm text-center">{`Se não saiu de casa, ta atrasado!`}</p>
          ) : (
            <Fragment>
              <p className="text-white text-2xl">
                {`${Math.round(differenceInHours)}`.padStart(2, "0")}
              </p>
              <p className="text-white text-sm">
                {Math.round(differenceInHours) === 1 ? "Hora" : "Horas"}
              </p>
            </Fragment>
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-24 h-24 bg-red-400 rounded-md p-3 mr-3 md:mr-2 md:m-2">
          {Math.round(differenceInMinutes) <= 0 ? (
            <p className="text-white text-sm text-center">{`É agora agora!!`}</p>
          ) : (
            <Fragment>
              <p className="text-white text-2xl">
                {`${Math.round(differenceInMinutes)}`.padStart(2, "0")}
              </p>
              <p className="text-white text-sm">
                {Math.round(differenceInMinutes) === 1 ? "Minuto" : "Minutos"}
              </p>
            </Fragment>
          )}
        </div>
        <div className="flex flex-col justify-center items-center w-24 h-24 bg-red-400 rounded-md p-3 mr-3 md:mr-2 md:m-2">
          {Math.round(differenceInSeconds) <= 0 ? (
            <p className="text-white text-sm text-center">{`Chegou o momento!`}</p>
          ) : (
            <Fragment>
              <p className="text-white text-2xl">
                {`${Math.round(differenceInSeconds)}`.padStart(2, "0")}
              </p>
              <p className="text-white text-sm">
                {Math.round(differenceInSeconds) === 1 ? "Segundo" : "Segundos"}
              </p>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
