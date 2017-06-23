"use strict";

//TODO create a priority tasks list which will push items in it by clicking on i.e. a Star-icon.
//TODO when user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
//TODO create a function so items in the completed list can be pushed back to the todoListUl (i.e when user accidentally click complete button).
//TODO line-through the completedTasks text (text-decoration prop CSS).
//TODO Add item to task list by pressing enterKey.
//TODO View option to only see the priority items.
//TODO Empty input form after items has been added.
//TODO integrate search method to search for specific items.
//TODO Search should ignore case-sensitivity.
//TODO Integrate Web Storage API to save data in the Storage object(localStorage).
//TODO Task in LocalStorage that has the data-attr = priority, should render as priority task when page is refresh/reload/visited again.
//TODO Task in LocalStorage that has already been completed should be rendered in the completedListUl when page is refresh/reload/visited again.
//TODO The priorityBtn of tasks in completedListUl should not be displayed when page is refresh/reloaded.
//TODO Program should save the specific date a task was created.
//TODO Program should save the specific date a task was completed.
//TODO Replace icons using font awesome icons.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date


// Construct the todoList object
var todoList = {

    // Array of items
    todos: [],

    // create method to display all todoItems in the list
    displayTodos: function displayTodos() {
        if (this.todos.length === 0) {
            console.log("The todo list is empty");
        } else {
            for (var i = 0; i < this.todos.length; i++) {
                if (this.todos[i].completed === true) {
                    console.log("(x)", this.todos[i].todoTitle);
                } else {
                    console.log("()", this.todos[i].todoTitle);
                }
            }
        }
    },

    // Create method to add todoItems to the list
    addTodo: function addTodo(todoTitle) {
        this.todos.push({
            todoTitle: todoTitle,
            completed: false
        });

        this.displayTodos();
    },

    // Create method to Change todoItems in the list
    changeTodoTitle: function changeTodoTitle(position, newTodoTitle) {
        this.todos[position].todoTitle = newTodoTitle;
        this.displayTodos();
    },

    // Create method to delete todoItems in the list
    deletedTodo: function deletedTodo(position) {
        this.todos.splice(position, 1);
        this.displayTodos();
    },

    // Create method to mark todoItems as completed in the list
    toggleCompleted: function toggleCompleted(position) {
        var todo = this.todos[position];
        todo.completed = !todo.completed;
        this.displayTodos();
    },

    // Create method to toggle all todoItems in the list as completed or !completed
    toggleAll: function toggleAll() {
        var totalTodos = this.todos.length;
        var completedTodos = 0;

        for (var i = 0; i < totalTodos; i++) {
            if (this.todos[i].completed === true) {
                completedTodos++;
            }
        }
        if (completedTodos === totalTodos) {
            for (var _i = 0; _i < totalTodos; _i++) {
                this.todos[_i].completed = false;
            }
        } else {
            for (var _i2 = 0; _i2 < totalTodos; _i2++) {
                this.todos[_i2].completed = true;
            }
        }
        this.displayTodos();
    }
};

// Handlers for the events the user triggers.
var handlers = {
    displayTodos: function displayTodos() {
        todoList.displayTodos();
    },
    toggleTodos: function toggleTodos() {
        todoList.toggleAll();
    },
    addTodo: function addTodo() {
        var addTodoInputValue = document.getElementById("addTodoValueInput");
        todoList.addTodo(addTodoInputValue.value);
        addTodoInputValue.value = "";
    }
};

//# sourceMappingURL=app-compiled.js.map