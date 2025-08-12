import ToDoSystem from "./todosystem.js";

class ToDoController {
    constructor (system, renderer) {
        this.system = system;
        this.renderer = renderer;
    }

    addProject (projectName) {this.system.addProject(projectName);}

    addTodo (projectID, todoData) {this.system.addTodo(projectID, todoData);}

    removeTodo (projectID, todoID) {this.system.removeTodo(projectID, todoID);}

    updateTodo (projectID, todoID, updates) {this.system.updateTodo(projectID, todoID, updates);}

    moveTodo (oldProjectID, newProjectID, todoID) {this.system.moveTodo(oldProjectID, newProjectID, todoID)}
}

class ToDoRenderer {
    draw (todos) {
        todos.projects.forEach(project => {
            console.log(project.id, project.name);
            project.todos.forEach(todo => {
                console.log(todo.details);
            });
        });
    }
}

let todos = new ToDoSystem();
let renderer = new ToDoRenderer();

let todoController = new ToDoController(todos, renderer);

function testSuite () {
    todoController.addProject("Tiger");
    todoController.addProject("Dolphin");
    todoController.addTodo(todoController.system.projects[0].id, {title: "Fetch tiger", description: "Go to the jungle, catch the tiger, and return him", dueDate: "05-15-1999", priority: "high"});
    todoController.addTodo(todoController.system.projects[0].id, {title: "Tame parrot", description: "Find a beautiful parrot and slowly charm it with food and pets", dueDate: "12-03-2001", priority: "medium"});
    todoController.renderer.draw(todoController.system);
    todoController.updateTodo(todoController.system.projects[0].id, todoController.system.projects[0].todos[0].id, {description: "Go to the North of India, find a tiger, catch him with bait, and return him, no exceptions", dueDate: "06-16-2023"});
    todoController.renderer.draw(todoController.system);
    todoController.moveTodo(todoController.system.projects[0].id, todoController.system.projects[1].id, todoController.system.projects[0].todos[0].id)
    todoController.renderer.draw(todoController.system);
}

testSuite();