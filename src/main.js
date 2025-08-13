/*
    TODO
    -- Add todos
    -- Add projects
    -- Edit todo
    -- Move todo to new project
    -- Persist to local storage
*/

import "./styles.css";

import deleteIconURL from "./icons/delete.svg";
import collapseIconURL from "./icons/collapse.svg";
import expandIconURL from "./icons/expand.svg";
import editIconURL from "./icons/edit.svg"

import ToDoSystem from "./todosystem.js";

class ToDoController {
    constructor(target, system, renderer) {
        this.system = system;
        this.renderer = renderer;
        this.target = target;
        this.uiState = {};
        this.uiState.todoState = {};

        target.addEventListener("click", this.clickHandler);
    }

    addProject(projectName) { this.system.addProject(projectName); }

    addTodo(projectID, todoData) { 
        let id = this.system.addTodo(projectID, todoData);
        this.uiState.todoState[id] = "collapsed"; 
    }

    removeTodo(projectID, todoID) { this.system.removeTodo(projectID, todoID); }

    updateTodo(projectID, todoID, updates) { this.system.updateTodo(projectID, todoID, updates); }

    moveTodo(oldProjectID, newProjectID, todoID) { this.system.moveTodo(oldProjectID, newProjectID, todoID) }

    expandTodo(project, todo) {
        this.renderer.drawExpandedTodo(project, todo);
        this.uiState.todoState[todo.id] = "expanded";
    }

    collapseTodo(project, todo) {
        this.renderer.drawCollapsedTodo(project, todo);
        this.uiState.todoState[todo.id] = "collapsed";
    }

    draw() { renderer.draw(this.target, this.system, this.uiState); }

    clickHandler = (e) => {
        if (e.target.classList.contains("delete-todo")) {
            this.removeTodo(e.target.dataset.projectID, e.target.dataset.todoID);
            this.draw();
        }
        if (e.target.classList.contains("expand-todo")) {
            this.uiState.todoState[e.target.dataset.todoID] = "expanded";
            this.draw();
        }
        if (e.target.classList.contains("collapse-todo")) {
            this.uiState.todoState[e.target.dataset.todoID] = "collapsed";
            this.draw();
        }
    }

}

class ToDoRenderer {
    clear() {
        document.querySelector("div#projects").replaceChildren();
    }

    drawExpandedTodo(project, todo) {
        let targetDiv = document.querySelector(`div[data-id="${todo.id}"`);
        targetDiv.replaceChildren();
        let iconsDiv = document.createElement("div");
        iconsDiv.classList.add("icons");

        let deleteIcon = document.createElement("img");
        deleteIcon.dataset.todoID = todo.id;
        deleteIcon.dataset.projectID = project.id;
        deleteIcon.classList.add("delete-todo");
        deleteIcon.src = deleteIconURL;

        let collapseIcon = document.createElement("img");
        collapseIcon.dataset.todoID = todo.id;
        collapseIcon.dataset.projectID = project.id;
        collapseIcon.classList.add("collapse-todo");
        collapseIcon.id = "expandCollapse"
        collapseIcon.src = collapseIconURL

        let editIcon = document.createElement("img");
        editIcon.dataset.todoID = todo.id;
        editIcon.dataset.projectID = project.id;
        editIcon.classList.add("edit-todo");
        editIcon.src = editIconURL;

        iconsDiv.append(editIcon, collapseIcon, deleteIcon);
        targetDiv.append(iconsDiv);

        for (let property in todo.formattedDetails) {
            let line = document.createElement("p");
            let propertyName = document.createElement("strong");
            propertyName.textContent = property + ": ";
            line.append(propertyName, todo.formattedDetails[property]);
            targetDiv.append(line);
        }
    }

    drawCollapsedTodo(project, todo) {
        let targetDiv = document.querySelector(`div[data-id="${todo.id}"`);
        targetDiv.replaceChildren();
        let iconsDiv = document.createElement("div");
        iconsDiv.classList.add("icons");

        let deleteIcon = document.createElement("img");
        deleteIcon.dataset.todoID = todo.id;
        deleteIcon.dataset.projectID = project.id;
        deleteIcon.classList.add("delete-todo");
        deleteIcon.src = deleteIconURL;

        let expandIcon = document.createElement("img");
        expandIcon.dataset.todoID = todo.id;
        expandIcon.dataset.projectID = project.id;
        expandIcon.classList.add("expand-todo");
        expandIcon.id = "expandCollapse"
        expandIcon.src = expandIconURL;

        let editIcon = document.createElement("img");
        editIcon.dataset.todoID = todo.id;
        editIcon.dataset.projectID = project.id;
        editIcon.classList.add("edit-todo");
        editIcon.src = editIconURL;

        iconsDiv.append(editIcon, expandIcon, deleteIcon);
        targetDiv.append(iconsDiv);

        let lineTitle = document.createElement("p");
        let labelTitle = document.createElement("strong");
        labelTitle.innerHTML = "Title: ";
        lineTitle.append(labelTitle, todo.title);

        let lineDueDate = document.createElement("p");
        let labelDueDate = document.createElement("strong");
        labelDueDate.innerHTML = "Due Date: ";
        lineDueDate.append(labelDueDate, todo.dueDate);

        targetDiv.append(lineTitle, lineDueDate);
    }

    draw(mainDiv, todos, uiState) {
        this.clear();

        console.log(uiState);

        todos.projects.forEach(project => {
            let projectDiv = document.createElement("div");
            projectDiv.classList.add("project");
            projectDiv.dataset.id = project.id;

            let projectName = document.createElement("h2");
            projectName.classList.add("project-name");
            projectName.textContent = project.name;
            projectDiv.append(projectName);
            mainDiv.append(projectDiv);

            project.todos.forEach(todo => {
                let todoDiv = document.createElement("div");
                todoDiv.classList.add("todo");
                todoDiv.dataset.id = todo.id;
                projectDiv.append(todoDiv);

                if (uiState.todoState[todo.id] === "expanded") this.drawExpandedTodo(project, todo);
                if (uiState.todoState[todo.id] === "collapsed") this.drawCollapsedTodo(project, todo);
            })
        });
    }
}

let todos = new ToDoSystem();
let renderer = new ToDoRenderer();

let todoController = new ToDoController(document.querySelector("div#projects"), todos, renderer);

function testSuiteHTML() {
    let mainDiv = document.querySelector("div#projects");
    todoController.addProject("Tiger");
    todoController.addProject("Dolphin");
    todoController.addTodo(todoController.system.projects[0].id, { title: "Fetch tiger", description: "Go to the jungle, catch the tiger, and return him", dueDate: "05-15-1999", priority: "high" });
    todoController.addTodo(todoController.system.projects[0].id, { title: "Tame parrot", description: "Find a beautiful parrot and slowly charm it with food and pets", dueDate: "12-03-2001", priority: "medium" });
    todoController.draw();
    todoController.updateTodo(todoController.system.projects[0].id, todoController.system.projects[0].todos[0].id, { description: "Go to the North of India, find a tiger, catch him with bait, and return him, no exceptions", dueDate: "06-16-2023" });
    todoController.draw();
    todoController.moveTodo(todoController.system.projects[0].id, todoController.system.projects[1].id, todoController.system.projects[0].todos[0].id)
    todoController.draw();
    todoController.expandTodo(todoController.system.projects[0], todoController.system.projects[0].todos[0]);
    todoController.collapseTodo(todoController.system.projects[0], todoController.system.projects[0].todos[0]);
}

testSuiteHTML();