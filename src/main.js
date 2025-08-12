class Todo {
    constructor (todoData) {
        this.title = todoData.title || null;
        this.description = todoData.description || null;
        this.dueDate = todoData.dueDate || null;
        this.priority = todoData.priority || null;
    }

    update (updates) {
        this.title = updates.title || this.title;
        this.description = updates.description || this.description;
        this.dueDate = updates.dueDate || this.dueDate;
        this.priority = updates.priority || this.priority;
    }
}

class Project {
    constructor (name) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = [];
    }

    addTodo (todo) {
        this.todos.push(todo);
    }

    removeTodo (todo) {
        this.todos.splice(this.todos.findIndex(item => item === todo), 1);
    }
}

class ToDoSystem {
    constructor () {
        this.projects = [];
    }
}

class ToDoController {
    constructor (system, renderer) {
        this.system = system;
        this.renderer = renderer;
    }

    addProject (projectName) {
        let newProject = new Project(projectName);
        this.system.projects.push(newProject);
        // console.log(`Added ${projectName}`)
    }

    addTodo (projectID, todoData) {
        let newTodo = new Todo(todoData);
        this.system.projects[this.system.projects.findIndex(project => project.id === projectID)].todos.push(newTodo);
    }
}

class ToDoRenderer {
    draw (todos) {
        todos.projects.forEach(project => {
            console.log(project.id, project.name);
            project.todos.forEach(todo => {
                console.log(todo);
            });
        });
    }
}

let todos = new ToDoSystem();
let renderer = new ToDoRenderer();

let todoController = new ToDoController(todos, renderer);

todoController.addProject("Tiger");
todoController.addTodo(todoController.system.projects[0].id, {title: "Fetch tiger", description: "Go to the jungle, catch the tiger, and return him", dueDate: "05-15-1999", priority: "high"});
todoController.addTodo(todoController.system.projects[0].id, {title: "Tame parrot", description: "Find a beautiful parrot and slowly charm it with food and pets", dueDate: "12-03-2001", priority: "medium"});
todoController.renderer.draw(todoController.system);