import Todo from "./todo.js";
import Project from "./project.js";

export default class ToDoSystem {
    constructor () {
        this.projects = [];
    }

    getProjectByID(projectID) {
        return this.projects.find(project => project.id === projectID);
    }

    addProject (projectName) {
        let newProject = new Project(projectName);
        this.projects.push(newProject);
    }

    addTodo (projectID, todoData) {
        let newTodo = new Todo(todoData);
        this.getProjectByID(projectID).addTodo(newTodo);
        return newTodo.id;
    }

    removeTodo (projectID, todoID) {
        this.getProjectByID(projectID).removeTodoByID(todoID);
    }

    updateTodo (projectID, todoID, updates) {
        this.getProjectByID(projectID).getTodoByID(todoID).update(updates);
    }

    moveTodo (oldProjectID, newProjectID, todoID) {
        this.getProjectByID(newProjectID).addTodo(this.getProjectByID(oldProjectID).getTodoByID(todoID));
        this.getProjectByID(oldProjectID).removeTodoByID(todoID);
    }
}