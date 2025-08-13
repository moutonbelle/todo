/*
    TODO
    -- Persist to local storage
*/

import "./styles.css";

import deleteIconURL from "./icons/delete.svg";
import collapseIconURL from "./icons/collapse.svg";
import expandIconURL from "./icons/expand.svg";
import editIconURL from "./icons/edit.svg"
import saveIconURL from "./icons/save.svg"
import cancelIconURL from "./icons/cancel.svg"
import addIconURL from "./icons/add.svg"

import ToDoSystem from "./todosystem.js";

class ToDoController {
    constructor(target, system, renderer) {
        this.system = system;
        this.renderer = renderer;
        this.target = target;

        this.uiState = {};
        this.uiState.todoState = {};

        if (localStorage.systemData) { this.load(); }

        this.draw();

        target.addEventListener("click", this.clickHandler);
    }

    addProject(projectName, projectID = null) { this.system.addProject(projectName, projectID); }

    removeProject(projectID) { this.system.removeProject(projectID); }

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

    save() {
        localStorage.clear();
        let systemData = {};
        let i = 0;
        this.system.projects.forEach(project => {
            systemData[i] = project.data;
            i++;
        });
        localStorage.systemData = JSON.stringify(systemData);
    }

    load() {
        this.system.projects = [];
        let systemData = JSON.parse(localStorage.systemData);

        for (let project in systemData) {
            this.addProject(systemData[project].name, systemData[project].id);
            systemData[project].todos.forEach(todo => {
                this.addTodo(systemData[project].id, todo);
            });
        }

        this.draw();
    }

    clickHandler = (e) => {
        if (e.target.classList.contains("delete-todo")) {
            this.removeTodo(e.target.dataset.projectID, e.target.dataset.todoID);
            this.draw();
            this.save();
        }
        if (e.target.classList.contains("expand-todo")) {
            this.uiState.todoState[e.target.dataset.todoID] = "expanded";
            this.draw();
        }
        if (e.target.classList.contains("collapse-todo")) {
            this.uiState.todoState[e.target.dataset.todoID] = "collapsed";
            this.draw();
        }
        if (e.target.classList.contains("edit-todo")) {
            this.uiState.todoState[e.target.dataset.todoID] = "editing";
            this.draw();
        }
        if (e.target.classList.contains("save-todo")) {
            let updates = {
                title: document.querySelector(".input-title").value,
                dueDate: document.querySelector(".input-date").value,
                description: document.querySelector(".input-description").value,
                priority: document.querySelector(".input-priority").value,
            }
            this.updateTodo(e.target.dataset.projectID, e.target.dataset.todoID, updates)
            this.uiState.todoState[e.target.dataset.todoID] = "expanded";
            this.draw();
            this.save();
        }
        if (e.target.classList.contains("cancel-todo-edit")) {
            if (this.system.getProjectByID(e.target.dataset.projectID).getTodoByID(e.target.dataset.todoID).title === null) this.removeTodo(e.target.dataset.projectID, e.target.dataset.todoID);
            else this.uiState.todoState[e.target.dataset.todoID] = "expanded";
            this.draw();
            this.save();
        }
        if (e.target.classList.contains("new-project-button")) {
            this.addProject(document.querySelector(".input-project-name").value);
            this.draw();
            this.save();
        }
        if (e.target.classList.contains("delete-project")) {
            this.removeProject(e.target.dataset.projectID);
            this.draw();
            this.save();
        }
        if (e.target.classList.contains("add-todo")) {
            let id = this.system.addTodo(e.target.dataset.projectID, {});
            this.uiState.todoState[id] = "editing";
            this.draw();
        }
    }

}

class ToDoRenderer {
    clear(mainDiv) {
        mainDiv.replaceChildren();
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

    drawEditingTodo(project, todo) {
        let targetDiv = document.querySelector(`div[data-id="${todo.id}"`);
        targetDiv.replaceChildren();
        let iconsDiv = document.createElement("div");
        iconsDiv.classList.add("icons");

        let cancelIcon = document.createElement("img");
        cancelIcon.dataset.todoID = todo.id;
        cancelIcon.dataset.projectID = project.id;
        cancelIcon.classList.add("cancel-todo-edit");
        cancelIcon.src = cancelIconURL;

        let saveIcon = document.createElement("img");
        saveIcon.dataset.todoID = todo.id;
        saveIcon.dataset.projectID = project.id;
        saveIcon.classList.add("save-todo");
        saveIcon.src = saveIconURL;

        iconsDiv.append(saveIcon, cancelIcon);
        targetDiv.append(iconsDiv);

        // Add title input
        let newline = document.createElement("p");
        let propertyName = document.createElement("strong");
        propertyName.textContent = "Title: ";
        let newInput = document.createElement("input");
        newInput.dataset.todoID = todo.id;
        newInput.dataset.projectID = project.id;
        newInput.classList.add("input-title");
        newInput.value = todo.title;
        newline.append(propertyName, newInput);
        targetDiv.append(newline);

        // Add date input
        newline = document.createElement("p");
        propertyName = document.createElement("strong");
        propertyName.textContent = "Due Date: ";
        newInput = document.createElement("input");
        newInput.type = "date";
        newInput.dataset.todoID = todo.id;
        newInput.dataset.projectID = project.id;
        newInput.classList.add("input-date");
        let todoDate = new Date(todo.dueDate);
        newInput.value = `${todoDate.getFullYear()}-${String(todoDate.getMonth() + 1).padStart(2, '0')}-${String(todoDate.getDate()).padStart(2, '0')}`;
        newline.append(propertyName, newInput);
        targetDiv.append(newline);

        // Add description input
        newline = document.createElement("p");
        propertyName = document.createElement("strong");
        propertyName.textContent = "Description: ";
        newInput = document.createElement("textarea");
        newInput.dataset.todoID = todo.id;
        newInput.dataset.projectID = project.id;
        newInput.rows = 5;
        newInput.classList.add("input-description");
        newInput.value = todo.description;
        newline.append(propertyName, newInput);
        targetDiv.append(newline);

        // Add priority input
        newline = document.createElement("p");
        propertyName = document.createElement("strong");
        propertyName.textContent = "Priority: ";

        newInput = document.createElement("select");
        newInput.dataset.todoID = todo.id;
        newInput.dataset.projectID = project.id;
        newInput.classList.add("input-priority");

        ["High", "Medium", "Low"].forEach(option => {
            let newOption = document.createElement("option");
            newOption.value = option;
            newOption.textContent = option;
            if (option === todo.priority) newOption.selected = true;
            newInput.append(newOption);
        });

        newline.append(propertyName, newInput);
        targetDiv.append(newline);
    }

    draw(mainDiv, todos, uiState) {
        this.clear(mainDiv);

        todos.projects.forEach(project => {
            let projectDiv = document.createElement("div");
            projectDiv.classList.add("project");
            projectDiv.dataset.id = project.id;

            let projectIcons = document.createElement("div");
            projectIcons.classList.add("icons");

            let deleteProjectIcon = document.createElement("img");
            deleteProjectIcon.dataset.projectID = project.id;
            deleteProjectIcon.classList.add("delete-project");
            deleteProjectIcon.src = deleteIconURL;

            let addTodoIcon = document.createElement("img");
            addTodoIcon.dataset.projectID = project.id;
            addTodoIcon.classList.add("add-todo");
            addTodoIcon.src = addIconURL;

            projectIcons.append(addTodoIcon, deleteProjectIcon);
            projectDiv.append(projectIcons);

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

                switch (uiState.todoState[todo.id]) {
                    case "expanded":
                        this.drawExpandedTodo(project, todo);
                        break;
                    case "collapsed":
                        this.drawCollapsedTodo(project, todo);
                        break;
                    case "editing":
                        this.drawEditingTodo(project, todo);
                        break;
                }
            })
        });

        let newProjectDiv = document.createElement("div");
        newProjectDiv.classList.add("new-project-container");
        let newProjectInput = document.createElement("input");
        newProjectInput.classList.add("input-project-name");
        newProjectInput.placeholder = "New project name";
        let newProjectButton = document.createElement("button");
        newProjectButton.classList.add("new-project-button");
        newProjectButton.textContent = "Create Project";

        newProjectDiv.append(newProjectInput, newProjectButton);
        mainDiv.append(newProjectDiv);
    }
}

let todos = new ToDoSystem();
let renderer = new ToDoRenderer();
let todoController = new ToDoController(document.querySelector("div#projects"), todos, renderer);