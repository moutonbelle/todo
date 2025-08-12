import "./styles.css";
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
    log (todos) {
        todos.projects.forEach(project => {
            console.log(project.id, project.name);
            project.todos.forEach(todo => {
                console.log(todo.details);
            });
        });
    }

    clear () {
        document.querySelector("div#projects").replaceChildren();
    }

    draw (todos) {
        this.clear();
        let mainDiv = document.querySelector("div#projects");

        todos.projects.forEach(project => {
            let projectDiv = document.createElement("div");
            projectDiv.classList.add("project");
            projectDiv.dataset.id = project.id;

            let projectName = document.createElement("h2");
            projectName.classList.add("project-name");
            projectName.textContent = project.name;
            projectDiv.append(projectName);

            project.todos.forEach(todo => {
                let todoDiv = document.createElement("div");
                todoDiv.classList.add("todo");
                todoDiv.dataset.id = todo.id;

                for (let property in todo.formattedDetails) {
                    let line = document.createElement("p");
                    let propertyName = document.createElement("strong");
                    propertyName.textContent = property + ": ";
                    line.append(propertyName, todo.formattedDetails[property]);
                    todoDiv.append(line);
                }

                projectDiv.append(todoDiv);
            })

            mainDiv.append(projectDiv);
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
    todoController.renderer.log(todoController.system);
    todoController.updateTodo(todoController.system.projects[0].id, todoController.system.projects[0].todos[0].id, {description: "Go to the North of India, find a tiger, catch him with bait, and return him, no exceptions", dueDate: "06-16-2023"});
    todoController.renderer.log(todoController.system);
    todoController.moveTodo(todoController.system.projects[0].id, todoController.system.projects[1].id, todoController.system.projects[0].todos[0].id)
    todoController.renderer.log(todoController.system);
}

function testSuiteHTML () {
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

testSuiteHTML();