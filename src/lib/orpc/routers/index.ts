import { projectsRouter } from "./projects"
import { todosRouter } from "./todos"
import { usersRouter } from "./users"

export default {
  projects: projectsRouter,
  todos: todosRouter,
  users: usersRouter,
}
