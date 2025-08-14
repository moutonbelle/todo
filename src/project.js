export default class Project {
  constructor(name, projectID = null) {
    if (projectID) this.id = projectID;
    else this.id = crypto.randomUUID();
    this.name = name;
    this.todos = [];
  }

  getTodoByID(todoID) {
    return this.todos.find((todo) => todo.id === todoID);
  }

  addTodo(todo) {
    this.todos.unshift(todo);
  }

  removeTodoByID(todoID) {
    this.todos.splice(
      this.todos.findIndex((todo) => todo.id === todoID),
      1,
    );
  }

  get data() {
    let data = { id: this.id, name: this.name };
    data.todos = [];
    this.todos.forEach((todo) => {
      data.todos.push(todo.details);
    });
    console.log("DATA", data);
    return data;
  }
}
