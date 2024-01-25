"use server";

import { cookies } from "next/headers";
import cookieParser from "./default";

const cookie = () => {
  return cookieParser(cookies().toString());
};
export default cookie;
