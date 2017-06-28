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


// Construct the lists object
var lists = {

    // Array of items
    todos: [],
    completedTodos: [],

    // Create method to add todoItems to the list
    addTodo: function addTodo(todoTitle) {
        var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        this.todos.unshift({
            todoTitle: todoTitle,
            completed: false,
            priority: priority
        });
    },
    deletedTodo: function deletedTodo(ul, position) {
        if (ul === "todoUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },
    makeTodoPriority: function makeTodoPriority(position) {
        var _this = this;

        var todo = this.todos.splice(position, 1);
        todo.forEach(function (todo) {
            _this.addTodo(todo.todoTitle, true);
        }, this);
    },


    // Create method to mark todoItems as completed in the list
    toggleCompleted: function toggleCompleted(position) {
        var todo = this.todos[position];
        todo.completed = !todo.completed;

        this.completedTodos.unshift({
            todoTitle: todo.todoTitle,
            completed: todo.completed,
            priority: todo.priority
        });
    },
    toggleNotCompleted: function toggleNotCompleted(position) {
        var todo = this.completedTodos[position];
        todo.completed = false;

        this.todos.push({
            todoTitle: todo.todoTitle,
            completed: todo.completed,
            priority: todo.priority
        });
    }
};

// Handlers for the events the user triggers.
var handlers = {
    addTodo: function addTodo() {
        var addTodoInputValue = document.getElementById("addTodoValueInput");
        lists.addTodo(addTodoInputValue.value);
        addTodoInputValue.value = "";
        view.displayTodos();
    },
    deleteTodo: function deleteTodo(ul, position) {
        lists.deletedTodo(ul, position);
        view.displayTodos();
        view.displayCompletedTodos();
    },
    makeTodoPriority: function makeTodoPriority(position) {
        lists.makeTodoPriority(position);
        view.displayTodos();
        view.displayCompletedTodos();
    },
    toggleCompleted: function toggleCompleted(ul, position) {
        lists.toggleCompleted(position);
        lists.deletedTodo(ul, position);
        view.displayTodos();
        view.displayCompletedTodos();
    },
    toggleNotCompleted: function toggleNotCompleted(position) {
        lists.toggleNotCompleted(position);
        lists.deletedTodo(null, position);
        view.displayTodos();
        view.displayCompletedTodos();
    }
};

var view = {
    todoUl: document.querySelector("#todoUl"),
    completedUl: document.querySelector("#completedUl"),

    displayTodos: function displayTodos() {
        var _this2 = this;

        this.todoUl.innerHTML = "";

        lists.todos.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            todoLi.id = position;
            todoLi.textContent = todo.todoTitle;
            todoLi.appendChild(_this2.createDeleteBtn());
            todoLi.appendChild(_this2.createPriorityBtn());
            todoLi.appendChild(_this2.createCompleteBtn());
            _this2.todoUl.appendChild(todoLi);
        }, this);
    },
    displayCompletedTodos: function displayCompletedTodos() {
        var _this3 = this;

        this.completedUl.innerHTML = "";

        lists.completedTodos.forEach(function (todo, position) {
            var completedLi = document.createElement("li");
            completedLi.id = "completed-" + position;
            completedLi.textContent = todo.todoTitle;
            todo.completed = !todo.completed;
            completedLi.appendChild(_this3.createDeleteBtn());
            completedLi.appendChild(_this3.createNotCompleteBtn());
            _this3.completedUl.appendChild(completedLi);
        }, this);
    },
    createDeleteBtn: function createDeleteBtn() {
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "deleteBtn";
        return deleteBtn;
    },
    createCompleteBtn: function createCompleteBtn() {
        var completedBtn = document.createElement("button");
        completedBtn.textContent = "Complete";
        completedBtn.className = "completedBtn";
        return completedBtn;
    },
    createPriorityBtn: function createPriorityBtn() {
        var priorityBtn = document.createElement("button");
        priorityBtn.textContent = "Priority";
        priorityBtn.className = "priority";
        return priorityBtn;
    },
    createNotCompleteBtn: function createNotCompleteBtn() {
        var notCompletedBtn = document.createElement("button");
        notCompletedBtn.textContent = "Mark as Todo";
        notCompletedBtn.className = "notCompletedBtn";
        return notCompletedBtn;
    },
    setupEventListeners: function setupEventListeners() {
        this.todoUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var ul = "todoUl";

            if (elementClicked.className === "deleteBtn") {
                handlers.deleteTodo(ul, parseInt(elementClicked.parentNode.id));
            } else if (elementClicked.className === "completedBtn") {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
            } else if (elementClicked.className === "priority") {
                handlers.makeTodoPriority(parseInt(elementClicked.parentNode.id));
            }
        });

        this.completedUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var ul = "completedUl";
            var position = elementClicked.parentNode.id.substr(10);

            if (elementClicked.className === "deleteBtn") {
                handlers.deleteTodo(ul, position);
            } else if (elementClicked.className === "notCompletedBtn") {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

view.setupEventListeners();

//# sourceMappingURL=app-compiled.js.map