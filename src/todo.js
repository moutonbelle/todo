export default class Todo {
    constructor (todoData) {
        this.id = crypto.randomUUID();
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

    get details () {
        return {
            id: this.id, 
            title: this.title, 
            description: this.description, 
            dueDate: this.dueDate, 
            priority: this.priority,
        };
    }

    get formattedDetails () {
        return {
            "Title": this.title,
            "Description": this.description,
            "Due Date": this.dueDate,
            "Priority": this.priority,
        }
    }
}