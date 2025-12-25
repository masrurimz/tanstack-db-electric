import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core"
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-arktype"
import { type } from "arktype"
export * from "./auth-schema"
import { users } from "./auth-schema"

export const projectsTable = pgTable(`projects`, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  shared_user_ids: text(`shared_user_ids`).array().notNull().default([]),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  owner_id: text(`owner_id`)
    .notNull()
    .references(() => users.id, { onDelete: `cascade` }),
})

export const todosTable = pgTable(`todos`, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: varchar({ length: 500 }).notNull(),
  completed: boolean().notNull().default(false),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  user_id: text(`user_id`)
    .notNull()
    .references(() => users.id, { onDelete: `cascade` }),
  project_id: integer(`project_id`)
    .notNull()
    .references(() => projectsTable.id, { onDelete: `cascade` }),
  user_ids: text(`user_ids`).array().notNull().default([]),
})

// Note: drizzle-arktype has a bug where createSelectSchema excludes generatedAlwaysAsIdentity columns
// We work around this by merging the id field back into the schema
const baseSelectProjectSchema = createSelectSchema(projectsTable)
export const selectProjectSchema = baseSelectProjectSchema.merge({
  id: type.number,
})
export const createProjectSchema =
  createInsertSchema(projectsTable).omit(`created_at`)
export const updateProjectSchema = createUpdateSchema(projectsTable)

const baseSelectTodoSchema = createSelectSchema(todosTable)
export const selectTodoSchema = baseSelectTodoSchema.merge({
  id: type.number,
})
export const createTodoSchema =
  createInsertSchema(todosTable).omit(`created_at`)
export const updateTodoSchema = createUpdateSchema(todosTable)

export type Project = typeof selectProjectSchema.infer
export type UpdateProject = typeof updateProjectSchema.infer
export type Todo = typeof selectTodoSchema.infer
export type UpdateTodo = typeof updateTodoSchema.infer

const baseSelectUsersSchema = createSelectSchema(users)
export const selectUsersSchema = baseSelectUsersSchema.merge({
  id: type.string,
})
