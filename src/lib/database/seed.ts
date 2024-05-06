import { db, sql } from "./kysely";

import type { ColumnBuilderCallback } from "kysely";

const cache = new Map<string, boolean>();

const guestsColumnNames: Record<
  string,
  {
    type: Parameters<
      ReturnType<(typeof db)["schema"]["createTable"]>["addColumn"]
    >[1];
    callback?: ColumnBuilderCallback;
  }
> = {
  id: {
    type: "serial",
    callback: (cb) => cb.primaryKey(),
  },
  name: {
    type: "varchar(500)",
    callback: (cb) => cb.notNull(),
  },
  email: {
    type: "varchar(255)",
  },
  phone: {
    type: "varchar(255)",
  },
  image: {
    type: "varchar(255)",
  },
  cpf_cnpj: {
    type: "varchar(255)",
  },
  instagram_user_id: {
    type: "varchar(255)",
  },
  is_going: {
    type: "boolean",
    callback: (cb) => cb.defaultTo(null),
  },
  number_of_people: {
    type: "bigint",
  },
  created_at: {
    type: sql`timestamp with time zone`,
    callback: (cb) => cb.defaultTo(sql`current_timestamp`),
  },
};

async function createGuestsTableTableOrModify() {
  if (cache.get("guests")) return;
  cache.set("guests", true);

  const exists = await db
    .selectFrom("pg_tables" as any)
    .where((eb) =>
      eb.and([eb("tablename", "=", "guests"), eb("schemaname", "=", "public")])
    )
    .execute();

  if (exists && exists.length > 0) {
    const columns = await db
      .selectFrom("information_schema.columns" as any)
      .select("column_name as columnName")
      .where((eb) =>
        eb.and([
          eb("table_name", "=", "guests"),
          eb("table_schema", "=", "public"),
        ])
      )
      .execute();
    const columnNames = columns.map((column) => column.columnName);
    const missingColumns = Object.keys(guestsColumnNames).filter(
      (columnName) => !columnNames.includes(columnName)
    );

    if (missingColumns.length === 0) return;

    let alterGuestsTableStatement: any = db.schema.alterTable("guests");
    for (const missingColumn of missingColumns) {
      const column = guestsColumnNames[missingColumn];
      alterGuestsTableStatement = alterGuestsTableStatement.addColumn(
        missingColumn,
        column.type,
        column.callback
      );
    }
    await (alterGuestsTableStatement as any).execute();
    return;
  }

  let createGuestTableStatement = db.schema.createTable("guests").ifNotExists();
  for (const [columnName, column] of Object.entries(guestsColumnNames)) {
    createGuestTableStatement = createGuestTableStatement.addColumn(
      columnName,
      column.type,
      column.callback
    );
  }
  await createGuestTableStatement.execute();
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
