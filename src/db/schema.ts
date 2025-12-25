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

export const selectProjectSchema = createSelectSchema(projectsTable)
export const createProjectSchema =
  createInsertSchema(projectsTable).omit(`created_at`)
export const updateProjectSchema = createUpdateSchema(projectsTable)

export const selectTodoSchema = createSelectSchema(todosTable)
export const createTodoSchema =
  createInsertSchema(todosTable).omit(`created_at`)
export const updateTodoSchema = createUpdateSchema(todosTable)

export type Project = typeof selectProjectSchema.infer
export type UpdateProject = typeof updateProjectSchema.infer
export type Todo = typeof selectTodoSchema.infer
export type UpdateTodo = typeof updateTodoSchema.infer

export const selectUsersSchema = createSelectSchema(users)
