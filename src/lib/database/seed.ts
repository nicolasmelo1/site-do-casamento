import { db, sql } from "./kysely";

const cache = new Map<string, boolean>();

async function createGuestsTableTableOrModify() {
  if (cache.get("guests")) return;
  cache.set("guests", true);

  const exists = await db
    .selectFrom("pg_tables" as any)
    .where((eb) =>
      eb.and([eb("tablename", "=", "guests"), eb("schemaname", "=", "public")])
    )
    .execute();

  if (exists && exists.length > 0) return;

  await db.schema
    .createTable("guests")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("name", "varchar(500)", (cb) => cb.notNull())
    .addColumn("cpf_cnpj", "varchar(20)")
    .addColumn("email", "varchar(255)")
    .addColumn("phone", "varchar(255)")
    .addColumn("image", "varchar(255)")
    .addColumn("instagram_user_id", "varchar(255)")
    .addColumn("is_going", "boolean", (cb) => cb.defaultTo(null))
    .addColumn("number_of_people", "bigint")
    .addColumn("created_at", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute();
}

async function createGuestsPresentsTableOrModify() {
  if (cache.get("guests_presents")) return;
  cache.set("guests_presents", true);

  const exists = await db
    .selectFrom("pg_tables" as any)
    .where((eb) =>
      eb.and([
        eb("tablename", "=", "guests_presents"),
        eb("schemaname", "=", "public"),
      ])
    )
    .execute();

  if (exists && exists.length > 0) return;

  await db.schema
    .createTable("guests_presents")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("guest_id", "integer", (col) =>
      col.references("guests.id").onDelete("cascade").notNull()
    )
    .addColumn("message", "text", (cb) => cb.notNull())
    .addColumn("created_at", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute();
}

export default async function seed() {
  await createGuestsTableTableOrModify();
  await createGuestsPresentsTableOrModify();
}
