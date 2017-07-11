"use strict";

// Create a method which will mark item as priority by clicking on i.e. a Star-icon.
// When user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
// Create a function so items in the completed list can be pushed back to the todoListUl (i.e when user accidentally click complete button).
// Line-through the completedTasks text (text-decoration prop CSS).
// Add item to task list by pressing enterKey.
// TODO View option to only see the priority items.
//TODO Option to clear all completed items.
// Empty input form after items has been added.
//TODO integrate search method to search for specific items.
//TODO Search should ignore case-sensitivity.
//TODO Integrate Web Storage API to save data in the Storage object(localStorage).
//TODO Task in LocalStorage that has the data-attr = priority, should render as priority task when page is refresh/reload/visited again.
//TODO Task in LocalStorage that has already been completed should be rendered in the completedListUl when page is refresh/reload/visited again.
//TODO Program should save the specific date a task was created.
//TODO Program should save the specific date a task was completed.
// Replace icons using font awesome icons.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date


// Bugs to fix:
//
// If there is no priority todoItem, view priorities button should be disabled.

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
        if (ul === "todoUl" || ul === "priorityUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },
    makeTodoPriority: function makeTodoPriority(position) {
        var _this = this;

        var todo = this.todos[position];

        if (todo.priority === true) {
            todo.priority = !todo.priority;
        } else {
            var removeTodoFromCurrentPosition = this.todos.splice(position, 1);

            removeTodoFromCurrentPosition.forEach(function (todo) {
                _this.addTodo(todo.todoTitle, true);
            }, this);
        }
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
    },
    filterPriority: function filterPriority() {
        return this.todos.filter(function (todo) {
            if (todo.priority !== false) {
                return todo;
            }
        });
    }
};

// Handlers for the events the user triggers.
var handlers = {
    addTodo: function addTodo(value) {
        lists.addTodo(value);
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
    },
    displayAllTodos: function displayAllTodos() {
        view.displayTodos();
        view.displayCompletedTodos();
    },
    filterPriority: function filterPriority() {
        view.displayPriorityTodos();
    }
};

var view = {
    todoUl: document.querySelector("#todoUl"),
    priorityUl: document.querySelector("#priorityUl"),
    completedUl: document.querySelector("#completedUl"),

    displayTodos: function displayTodos() {
        var _this2 = this;

        this.todoUl.innerHTML = "";
        this.priorityUl.innerHTML = "";

        lists.todos.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            todoLi.id = position;
            todoLi.textContent = todo.todoTitle;
            todoLi.prepend(_this2.createCheckBox());
            var btnDiv = _this2.createBtnDiv();

            if (todo.priority === false) {
                btnDiv.appendChild(_this2.createPriorityInitialIcon());
            } else {
                btnDiv.appendChild(_this2.createPriorityIcon());
            }

            btnDiv.appendChild(_this2.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            _this2.todoUl.appendChild(todoLi);
        }, this);
    },
    displayPriorityTodos: function displayPriorityTodos() {
        var _this3 = this;

        this.todoUl.innerHTML = "";
        this.completedUl.style.display = "none";

        var todos = lists.filterPriority();

        todos.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            todoLi.id = position;
            todoLi.textContent = todo.todoTitle;
            todoLi.prepend(_this3.createCheckBox());
            var btnDiv = _this3.createBtnDiv();

            btnDiv.appendChild(_this3.createPriorityIcon());
            btnDiv.appendChild(_this3.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            _this3.priorityUl.appendChild(todoLi);
        }, this);
    },
    displayCompletedTodos: function displayCompletedTodos() {
        var _this4 = this;

        this.completedUl.innerHTML = "";
        this.priorityUl.innerHTML = "";

        lists.completedTodos.forEach(function (todo, position) {
            var completedLi = document.createElement("li");
            completedLi.id = "completed-" + position;
            completedLi.textContent = todo.todoTitle;
            todo.completed = !todo.completed;
            var checkbox = _this4.createCheckBox();
            checkbox.checked = true;
            completedLi.prepend(checkbox);

            var btnDiv = _this4.createBtnDiv();
            btnDiv.appendChild(_this4.createDeleteIcon());

            completedLi.appendChild(btnDiv);
            _this4.completedUl.appendChild(completedLi);
        }, this);
    },
    createBtnDiv: function createBtnDiv() {
        var btnDiv = document.createElement("div");
        btnDiv.className = "btnDiv";
        return btnDiv;
    },
    createDeleteIcon: function createDeleteIcon() {
        var deleteBtn = document.createElement("i");
        deleteBtn.classList.add("deleteBtn", "fa", "fa-trash-o", "fa-fw", "fa-2x");
        deleteBtn.setAttribute("aria-hidden", "true");
        return deleteBtn;
    },
    createCheckBox: function createCheckBox() {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkBox";
        return checkbox;
    },
    createPriorityInitialIcon: function createPriorityInitialIcon() {
        var priorityBtn = document.createElement("i");
        priorityBtn.classList.add("priorityBtn", "fa", "fa-star-o", "fa-fw", "fa-2x");
        priorityBtn.setAttribute("aria-hidden", "true");
        return priorityBtn;
    },
    createPriorityIcon: function createPriorityIcon() {
        var priorityBtn = document.createElement("i");
        priorityBtn.classList.add("priorityBtn", "fa", "fa-star", "fa-fw", "fa-2x");
        priorityBtn.setAttribute("aria-hidden", "true");
        return priorityBtn;
    },
    setupEventListeners: function setupEventListeners() {
        var _this5 = this;

        var addTodoInputValue = document.getElementById("addTodoValueInput");
        var toggleAllTodos = document.querySelector(".toggleAllTodos");
        var filterPriorityTodos = document.querySelector(".togglePriorityTodos");

        addTodoInputValue.addEventListener("keyup", function (event) {
            if (event.key === "Enter" && addTodoInputValue.value !== "") {
                handlers.addTodo(addTodoInputValue.value);
                addTodoInputValue.value = "";
            }
        });

        toggleAllTodos.addEventListener("click", function () {
            _this5.todoUl.style.display = "";
            handlers.displayAllTodos();
        });

        var filterPriority = function filterPriority() {
            _this5.todoUl.style.display = "none";
            var priorityTodoList = lists.filterPriority();
            if (priorityTodoList.length > 0) {
                handlers.filterPriority();
            }
        };

        filterPriorityTodos.addEventListener("click", filterPriority);

        this.todoUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var elementParentIdValue = parseInt(elementClicked.parentNode.parentNode.id);
            var ul = "todoUl";

            if (elementClicked.classList.contains("deleteBtn")) {
                handlers.deleteTodo(ul, elementParentIdValue);
            } else if (elementClicked.checked) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
            } else if (elementClicked.classList.contains("priorityBtn")) {
                handlers.makeTodoPriority(elementParentIdValue);
            }
        });

        this.completedUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var ul = "completedUl";
            var position = elementClicked.parentNode.id.substr(10);

            if (elementClicked.className === "deleteBtn") {
                handlers.deleteTodo(ul, position);
            } else if (!elementClicked.checked) {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

view.setupEventListeners();

//# sourceMappingURL=app-compiled.js.map