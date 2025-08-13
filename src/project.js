export default class Project {
    constructor (name) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = [];
    }

    getTodoByID(todoID) {
        return this.todos.find(todo => todo.id === todoID);
    }

    addTodo (todo) {
        this.todos.unshift(todo);
    }

    removeTodoByID (todoID) {
        this.todos.splice(this.todos.findIndex(todo => todo.id === todoID), 1);
    }
}