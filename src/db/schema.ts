import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
});

export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  professionals: many(professionalTable),
}));

export const professionalTable = pgTable("professional", {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoryTable.id),
  name: text().notNull(),
  slug: text().notNull().unique(),
  //imageUrl: text("image_url").notNull(),
  pronoun: text().notNull(),
  specialty: text().notNull(),
  city: text().notNull(),
  agreements: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const professionalRelations = relations(
  professionalTable,
  ({ one }) => ({
    category: one(categoryTable, {
      fields: [professionalTable.categoryId],
      references: [categoryTable.id],
    }),
  }),
);
