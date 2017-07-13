"use strict";

// Create a method which will mark item as priority by clicking on i.e. a Star-icon.
// When user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
// Create a function so items in the completed list can be pushed back to the todoListUl (i.e when user accidentally click complete button).
// Line-through the completedTasks text (text-decoration prop CSS).
// Add item to task list by pressing enterKey.
// View option to only see the priority items.
// Option to clear all completed items.
// Empty input form after items has been added.
// Replace icons using font awesome icons.

//TODO When app is init, focus must be on the input.
//TODO integrate search method to search for specific items.
//TODO Search should ignore case-sensitivity.
//TODO Integrate Web Storage API to save data in the Storage object(localStorage).
//TODO Task in LocalStorage that has the data-attr = priority, should render as priority task when page is refresh/reload/visited again.
//TODO Task in LocalStorage that has already been completed should be rendered in the completedListUl when page is refresh/reload/visited again.
//TODO Program should save the specific date a task was created.
//TODO Program should save the specific date a task was completed.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date


// Construct the lists object
var lists = {

    // Array of items
    todos: [],
    priorityTodos: [],
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
    clearAllCompletedTodos: function clearAllCompletedTodos() {
        this.completedTodos.splice(0);
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
    filterPriorityTodos: function filterPriorityTodos() {
        var _this2 = this;

        return this.todos.filter(function (todo) {
            if (todo.priority !== false) {
                return _this2.priorityTodos.unshift({
                    todoTitle: todo.todoTitle,
                    completed: todo.completed,
                    priority: todo.priority
                });
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
    clearAllCompletedTodos: function clearAllCompletedTodos() {
        lists.clearAllCompletedTodos();
    },
    filterPriorityTodos: function filterPriorityTodos() {
        view.displayPriorityTodos(lists.filterPriorityTodos());
    }
};

var view = {
    todoUl: document.querySelector("#todoUl"),
    completedUl: document.querySelector("#completedUl"),

    displayTodos: function displayTodos() {
        var _this3 = this;

        this.todoUl.innerHTML = "";
        this.completedUl.style.display = "";

        lists.todos.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            todoLi.id = position;
            todoLi.textContent = todo.todoTitle;
            todoLi.prepend(_this3.createCheckBox());
            var btnDiv = _this3.createBtnDiv();

            if (todo.priority === false) {
                btnDiv.appendChild(_this3.createPriorityInitialIcon());
            } else {
                btnDiv.appendChild(_this3.createPriorityIcon());
            }

            btnDiv.appendChild(_this3.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            _this3.todoUl.appendChild(todoLi);
        }, this);
    },
    displayPriorityTodos: function displayPriorityTodos(priorityTodosList) {
        var _this4 = this;

        this.todoUl.innerHTML = "";
        this.completedUl.style.display = "none";

        priorityTodosList.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            todoLi.id = position;
            todoLi.textContent = todo.todoTitle;
            todoLi.prepend(_this4.createCheckBox());
            var btnDiv = _this4.createBtnDiv();

            btnDiv.appendChild(_this4.createPriorityIcon());
            btnDiv.appendChild(_this4.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            _this4.todoUl.appendChild(todoLi);
        }, this);
    },
    displayCompletedTodos: function displayCompletedTodos() {
        var _this5 = this;

        this.completedUl.innerHTML = "";

        lists.completedTodos.forEach(function (todo, position) {
            var completedLi = document.createElement("li");
            completedLi.id = "completed-" + position;
            completedLi.textContent = todo.todoTitle;
            todo.completed = !todo.completed;
            var checkbox = _this5.createCheckBox();
            checkbox.checked = true;
            completedLi.prepend(checkbox);

            var btnDiv = _this5.createBtnDiv();
            btnDiv.appendChild(_this5.createDeleteIcon());

            completedLi.appendChild(btnDiv);
            _this5.completedUl.appendChild(completedLi);
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
        var _this6 = this;

        var addTodoInputValue = document.querySelector("#addTodoValueInput");
        var toggleAllTodosBtn = document.querySelector(".toggleAllTodos");
        var filterPriorityTodosBtn = document.querySelector(".togglePriorityTodos");
        var clearCompletedTodos = document.querySelector(".clearCompletedTodos");

        addTodoInputValue.addEventListener("keyup", function (event) {
            if (event.key === "Enter" && addTodoInputValue.value !== "") {
                handlers.addTodo(addTodoInputValue.value);
                addTodoInputValue.value = "";
            }
        });

        toggleAllTodosBtn.addEventListener("click", function () {
            _this6.todoUl.style.display = "";
            handlers.displayAllTodos();
        });

        clearCompletedTodos.addEventListener("click", function () {
            handlers.clearAllCompletedTodos();
            handlers.displayAllTodos();
        });

        var filterPriorityTodos = function filterPriorityTodos() {
            var priorityTodoList = lists.filterPriorityTodos();
            if (priorityTodoList.length === 0) {
                _this6.todoUl.classList.remove("priority-active");
                handlers.displayAllTodos();
            } else if (priorityTodoList.length > 0) {
                _this6.todoUl.classList.add("priority-active");
                handlers.filterPriorityTodos();
            }
        };

        filterPriorityTodosBtn.addEventListener("click", filterPriorityTodos);

        this.todoUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var elementParentIdValue = parseInt(elementClicked.parentNode.parentNode.id);
            var ul = "todoUl";

            if (elementClicked.classList.contains("deleteBtn") && _this6.todoUl.classList.contains("priority-active")) {
                handlers.deleteTodo(ul, elementParentIdValue);
                filterPriorityTodos();
            } else if (elementClicked.classList.contains("deleteBtn")) {
                handlers.deleteTodo(ul, elementParentIdValue);
            }

            if (elementClicked.checked && _this6.todoUl.classList.contains("priority-active")) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
                filterPriorityTodos();
            } else if (elementClicked.checked) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
            }

            if (elementClicked.classList.contains("priorityBtn") && _this6.todoUl.classList.contains("priority-active")) {
                handlers.makeTodoPriority(elementParentIdValue);
                filterPriorityTodos();
            } else if (elementClicked.classList.contains("priorityBtn")) {
                handlers.makeTodoPriority(elementParentIdValue);
            }
        });

        this.completedUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var ul = "completedUl";
            var position = elementClicked.parentNode.id.substr(10);

            if (elementClicked.classList.contains("deleteBtn")) {
                handlers.deleteTodo(ul, position);
            } else if (!elementClicked.checked) {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

view.setupEventListeners();

//# sourceMappingURL=app-compiled.js.map