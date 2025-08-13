export default class Todo {
    constructor(todoData) {
        if (todoData.id) this.id = todoData.id; else this.id = crypto.randomUUID();
        this.title = todoData.title || null;
        this.description = todoData.description || null;
        if (todoData.dueDate) this.dueDate = todoData.dueDate;
        else {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            const formattedToday = `${year}-${month}-${day}`;
            this.dueDate = formattedToday;
        }
        this.priority = todoData.priority || null;
    }

    update(updates) {
        this.title = updates.title || this.title;
        this.description = updates.description || this.description;
        this.dueDate = updates.dueDate || this.dueDate;
        this.priority = updates.priority || this.priority;
    }

    get details() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
        };
    }

    get formattedDetails() {
        return {
            "Title": this.title,
            "Due Date": this.dueDate,
            "Description": this.description,
            "Priority": this.priority,
        }
    }
}