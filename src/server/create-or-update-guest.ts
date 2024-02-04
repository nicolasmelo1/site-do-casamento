import { db } from "../lib";

export default async function createOrUpdateGuest(
  name: string,
  cpfCnpj: string,
  phone: string | undefined,
  isGoing: boolean | undefined = true
) {
  const existingGuests = await db
    .selectFrom("guests")
    .selectAll()
    .where((eb) =>
      eb.or([eb("cpfCnpj", "=", cpfCnpj), eb("phone", "=", phone)])
    )
    .execute();
  const existingGuest =
    existingGuests.length > 0 ? existingGuests[0] : undefined;
  let existingGuestId = existingGuest?.id;
  if (typeof existingGuest?.id === "number") {
    const dataToSet: {
      name: string;
      cpfCnpj: string;
      phone?: string;
      isGoing?: boolean;
    } = {
      name,
      cpfCnpj,
    };

    if (typeof phone === "string" && phone.length > 0) dataToSet.phone = phone;
    if (typeof isGoing === "boolean") dataToSet.isGoing = isGoing;

    await db
      .updateTable("guests")
      .set(dataToSet)
      .where("id", "=", existingGuest.id)
      .execute();
  } else {
    const newGuest = await db
      .insertInto("guests")
      .values({
        isGoing,
        name,
        cpfCnpj,
      })
      .executeTakeFirst();
    if (newGuest.insertId)
      existingGuestId = newGuest.insertId as unknown as number;
  }
  return existingGuestId;
}
