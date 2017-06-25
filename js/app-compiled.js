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

    // Create method to add todoItems to the list
    addTodo: function addTodo(todoTitle) {
        this.todos.push({
            todoTitle: todoTitle,
            completed: false
        });
    },

    // Create method to Change todoItems in the list
    changeTodoTitle: function changeTodoTitle(position, newTodoTitle) {
        this.todos[position].todoTitle = newTodoTitle;
    },

    // Create method to delete todoItems in the list
    deletedTodo: function deletedTodo(position) {
        this.todos.splice(position, 1);
    },

    // Create method to mark todoItems as completed in the list
    toggleCompleted: function toggleCompleted(position) {
        var todo = this.todos[position];
        todo.completed = !todo.completed;
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
    }
};

// Handlers for the events the user triggers.
var handlers = {
    addTodo: function addTodo() {
        var addTodoInputValue = document.getElementById("addTodoValueInput");
        todoList.addTodo(addTodoInputValue.value);
        addTodoInputValue.value = "";
        view.displayTodos();
    },
    changeTodo: function changeTodo() {
        var changeTodoPositionInput = document.querySelector("#changeTodoPosition");
        var changeTodoValueInput = document.querySelector("#changeTodoTextInput");
        todoList.changeTodoTitle(changeTodoPositionInput.valueAsNumber, changeTodoValueInput.value);
        changeTodoPositionInput.value = "";
        changeTodoValueInput.value = "";
        view.displayTodos();
    },
    deleteTodo: function deleteTodo() {
        var deleteTodoPositionInput = document.querySelector("#deleteTodoPositionInput");
        todoList.deletedTodo(deleteTodoPositionInput.valueAsNumber);
        deleteTodoPositionInput.value = "";
        view.displayTodos();
    },
    toggleCompleted: function toggleCompleted() {
        var completedTodoPosition = document.querySelector("#completedTodoPosition");
        todoList.toggleCompleted(completedTodoPosition.valueAsNumber);
        completedTodoPosition.value = "";
        view.displayTodos();
    },
    toggleTodos: function toggleTodos() {
        todoList.toggleAll();
        view.displayTodos();
    }
};

var view = {
    displayTodos: function displayTodos() {
        var todoUl = document.querySelector("ul");
        todoUl.innerHTML = "";

        for (var i = 0; i < todoList.todos.length; i++) {
            var todos = todoList.todos[i];
            var todoLi = document.createElement("li");
            var todoWithCompletion = "";

            if (todos.completed === true) {
                todoWithCompletion = "(x)" + todos.todoTitle;
            } else {
                todoWithCompletion = "( )" + todos.todoTitle;
            }

            todoLi.textContent = todoWithCompletion;
            todoUl.appendChild(todoLi);
        }
    }
};

//# sourceMappingURL=app-compiled.js.map