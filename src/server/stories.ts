import { db } from "../lib";

export async function saveStory(fileName: string) {
  const stories = await db
    .insertInto("stories")
    .columns(['fileName'])
    .values({
      fileName,
    })
    .execute();
  return stories;
}


export async function getStories() {
  const stories = await db
    .selectFrom("stories")
    .selectAll()
    .where("hasShown", "=", false)
    .orderBy("createdAt", "asc")
    .limit(1)
    .execute();

  if (stories.length > 0) {
    await db
      .updateTable("stories")
      .set({ hasShown: true })
      .where("id", "=", stories[0].id)
      .execute();
  }
  
  return stories;
}
/*
export async function createOrUpdateGuest(
  name: string,
  cpfCnpj: string,
  phone: string | undefined,
  isGoing: boolean | undefined = true
) {
  const existingGuest = await getGuest(cpfCnpj, phone);
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
*/