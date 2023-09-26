const todoInput = document.querySelector(".todo-input");
const dueDateInput = document.querySelector(".due-date-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click"   , deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    event.preventDefault();
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const dueDate = document.createElement("span");
    dueDate.innerText = dueDateInput.value;
    dueDate.classList.add("due-date");
    todoDiv.appendChild(dueDate);

    saveLocalTodos(todoInput.value, dueDateInput.value);
    
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    
    todoList.appendChild(todoDiv);
    todoInput.value = "";
    dueDateInput.value = "";
}

function deleteCheck(e) {
    const item = e.target;

    if(item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        todo.classList.add("slide");

        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo() {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(filterOption.value) {
            case "all": 
                todo.style.display = "flex";
                break;
            case "completed": 
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo, dueDate) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({ todo, dueDate });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(function(item) {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        
        const newTodo = document.createElement("li");
        newTodo.innerText = item.todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const dueDate = document.createElement("span");
        dueDate.innerText = item.dueDate;
        dueDate.classList.add("due-date");
        todoDiv.appendChild(dueDate);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        todoDiv.appendChild(trashButton);

        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todo.children[0].innerText;
    todos.forEach(function(item, index) {
        if (item.todo === todoIndex) {
            todos.splice(index, 1);
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}
class Task {
    constructor(name) {
        this.name = name;
        this.dueDate = null;
        this.tags = [];
        this.completed = false;
    }

    setDueDate(date) {
        this.dueDate = date;
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    markCompleted() {
        this.completed = true;
    }

    // Memento pattern: Create a snapshot of the task's state
    createMemento() {
        return {
            name: this.name,
            dueDate: this.dueDate,
            tags: [...this.tags],
            completed: this.completed,
        };
    }

    // Memento pattern: Restore the task's state from a snapshot
    restoreMemento(memento) {
        this.name = memento.name;
        this.dueDate = memento.dueDate;
        this.tags = [...memento.tags];
        this.completed = memento.completed;
    }
}

// TaskBuilder for constructing tasks with optional attributes
class TaskBuilder {
    constructor(name) {
        this.task = new Task(name);
    }

    withDueDate(date) {
        this.task.setDueDate(date);
        return this;
    }

    withTag(tag) {
        this.task.addTag(tag);
        return this;
    }

    build() {
        return this.task;
    }
}

// Example usage of the Task and TaskBuilder classes
const task1 = new TaskBuilder("Buy groceries")
    .withDueDate("2023-09-30")
    .withTag("Personal")
    .build();

const task2 = new TaskBuilder("Finish project").build();

console.log(task1);
console.log(task2);