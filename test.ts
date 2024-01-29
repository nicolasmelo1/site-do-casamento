import { db } from "./src/lib";

async function main() {
  const guests = await db.selectFrom("guests").execute();
}

main();
