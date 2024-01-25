"use client";

import cookieParser from "./default";

const cookie = () =>
  cookieParser(typeof document === "undefined" ? "" : document?.cookie || "");
export default cookie;
