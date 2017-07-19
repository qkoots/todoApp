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
// Task in LocalStorage that has property of priority, should render as priority task when page is refresh/reload/visited again.
// Task in LocalStorage that has already been completed should be rendered in the completedListUl when page is refresh/reload/visited again.

//TODO When app is init, focus must be on the input.
//TODO integrate search method to search for specific items.
//TODO Search should ignore case-sensitivity.
//TODO Integrate Web Storage API to save data in the Storage object(localStorage).
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
    storageArray: [],

    pushAllTodosInStorageArray: function pushAllTodosInStorageArray() {
        var _this = this;

        this.storageArray.splice(0);

        this.todos.forEach(function (todo) {
            _this.storageArray.push(todo);
        });

        this.completedTodos.forEach(function (todo) {
            _this.storageArray.push(todo);
        });
    },
    storeTodosInLocalStorage: function storeTodosInLocalStorage() {
        var storage = localStorage;

        this.storageArray.forEach(function (todo, position) {

            var todoObj = {
                title: todo.todoTitle,
                completed: todo.completed,
                priority: todo.priority
            };
            storage.setItem(position, JSON.stringify(todoObj));
        });
    },


    // Create method to add todoItems to the list
    addTodo: function addTodo(todoTitle) {
        var completed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.todos.unshift({
            todoTitle: todoTitle,
            completed: completed,
            priority: priority
        });
    },
    addCompletedTodo: function addCompletedTodo(todoTitle) {
        var completed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.completedTodos.push({
            todoTitle: todoTitle,
            completed: completed,
            priority: priority
        });
    },
    retrieveTodosFromStorage: function retrieveTodosFromStorage() {
        var _this2 = this;

        var storage = localStorage;

        Object.keys(storage).forEach(function (key) {
            var todo = JSON.parse(storage.getItem(key));

            if (todo.completed === false) {
                _this2.addTodo(todo.title, todo.completed, todo.priority);
            } else {
                _this2.addCompletedTodo(todo.title, todo.completed, todo.priority);
            }
        });
    },
    removeTodoFromStorage: function removeTodoFromStorage(textValue) {
        var storage = localStorage;

        if (Array.isArray(textValue)) {
            textValue.forEach(function (todo) {
                Object.keys(storage).forEach(function (key) {
                    var title = JSON.parse(storage[key]).title;
                    if (title === todo) {
                        storage.removeItem(key);
                    }
                });
            });
        } else {
            Object.keys(storage).forEach(function (key) {
                var title = JSON.parse(storage[key]).title;
                if (title === textValue) {
                    storage.removeItem(key);
                }
            });
        }
    },
    deletedTodo: function deletedTodo(ul, position) {
        if (ul === "todoUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },
    clearAllCompletedTodos: function clearAllCompletedTodos() {
        var arr = [];

        this.completedTodos.forEach(function (todo) {
            arr.push(todo.todoTitle);
        });

        this.completedTodos.splice(0);

        return arr;
    },
    makeTodoPriority: function makeTodoPriority(position) {
        var _this3 = this;

        var todo = this.todos[position];

        if (todo.priority === true) {
            todo.priority = !todo.priority;
        } else {
            var removeTodoFromCurrentPosition = this.todos.splice(position, 1); // Removes the todoItem from its current position in the todosArray.

            removeTodoFromCurrentPosition.forEach(function (todo) {
                _this3.addTodo(todo.todoTitle, todo.completed, true); // Insert the todoItem at the beginning of the todosArray by calling the addTodo method.
            }, this);
        }
    },


    // Create method to mark todoItems as completed in the list
    toggleCompleted: function toggleCompleted(position) {
        var todo = this.todos[position];

        this.completedTodos.unshift({
            todoTitle: todo.todoTitle,
            completed: !todo.completed,
            priority: todo.priority
        });
    },
    toggleNotCompleted: function toggleNotCompleted(position) {
        var todo = this.completedTodos[position];

        this.todos.push({
            todoTitle: todo.todoTitle,
            completed: !todo.completed,
            priority: todo.priority
        });
    },
    filterPriorityTodos: function filterPriorityTodos() {
        var _this4 = this;

        return this.todos.filter(function (todo) {
            if (todo.priority !== false) {
                return _this4.priorityTodos.unshift({
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
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
    },
    deleteTodo: function deleteTodo(ul, position) {
        lists.deletedTodo(ul, position);
        lists.pushAllTodosInStorageArray();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    makeTodoPriority: function makeTodoPriority(position) {
        lists.makeTodoPriority(position);
        lists.pushAllTodosInStorageArray();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    toggleCompleted: function toggleCompleted(ul, position) {
        lists.toggleCompleted(position);
        lists.deletedTodo(ul, position);
        lists.pushAllTodosInStorageArray();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    toggleNotCompleted: function toggleNotCompleted(position) {
        lists.toggleNotCompleted(position);
        lists.deletedTodo(null, position);
        lists.pushAllTodosInStorageArray();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    displayAllTodos: function displayAllTodos() {
        view.displayTodos();
        view.displayCompletedTodos();
    },
    clearAllCompletedTodos: function clearAllCompletedTodos() {
        lists.removeTodoFromStorage(lists.clearAllCompletedTodos());
        lists.pushAllTodosInStorageArray();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    filterPriorityTodos: function filterPriorityTodos() {
        view.displayPriorityTodos(lists.filterPriorityTodos());
    },
    removeTodoFromStorage: function removeTodoFromStorage(textValue) {
        lists.removeTodoFromStorage(textValue);
    }
};

var view = {
    todoUl: document.querySelector("#todoUl"),
    completedUl: document.querySelector("#completedUl"),

    displayTodos: function displayTodos() {
        var _this5 = this;

        this.todoUl.innerHTML = "";
        this.completedUl.style.display = "";

        lists.todos.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            var textNode = document.createTextNode(todo.todoTitle);
            todoLi.id = position;
            todoLi.appendChild(textNode);
            todoLi.prepend(_this5.createCheckBox());
            var btnDiv = _this5.createBtnDiv();

            if (todo.priority === false) {
                btnDiv.appendChild(_this5.createPriorityInitialIcon());
            } else {
                btnDiv.appendChild(_this5.createPriorityIcon());
            }

            btnDiv.appendChild(_this5.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            _this5.todoUl.appendChild(todoLi);
        }, this);
    },
    displayPriorityTodos: function displayPriorityTodos(priorityTodosList) {
        var _this6 = this;

        this.todoUl.innerHTML = "";
        this.completedUl.style.display = "none";

        priorityTodosList.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            var textNode = document.createTextNode(todo.todoTitle);
            todoLi.id = position;
            todoLi.appendChild(textNode);
            todoLi.prepend(_this6.createCheckBox());
            var btnDiv = _this6.createBtnDiv();

            btnDiv.appendChild(_this6.createPriorityIcon());
            btnDiv.appendChild(_this6.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            _this6.todoUl.appendChild(todoLi);
        }, this);
    },
    displayCompletedTodos: function displayCompletedTodos() {
        var _this7 = this;

        this.completedUl.innerHTML = "";

        lists.completedTodos.forEach(function (todo, position) {
            var completedLi = document.createElement("li");
            var textNode = document.createTextNode(todo.todoTitle);
            completedLi.id = "completed-" + position;
            completedLi.appendChild(textNode);
            var checkbox = _this7.createCheckBox();
            checkbox.checked = true;
            completedLi.prepend(checkbox);

            var btnDiv = _this7.createBtnDiv();
            btnDiv.appendChild(_this7.createDeleteIcon());

            completedLi.appendChild(btnDiv);
            _this7.completedUl.appendChild(completedLi);
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
        var _this8 = this;

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
            _this8.todoUl.style.display = "";
            handlers.displayAllTodos();
        });

        clearCompletedTodos.addEventListener("click", function () {
            handlers.clearAllCompletedTodos();
        });

        var filterPriorityTodos = function filterPriorityTodos() {
            var priorityTodoList = lists.filterPriorityTodos();
            if (priorityTodoList.length === 0) {
                handlers.displayAllTodos();
            } else if (priorityTodoList.length > 0) {
                handlers.filterPriorityTodos();
            }
        };

        filterPriorityTodosBtn.addEventListener("click", filterPriorityTodos);

        this.todoUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var elementParentIdValue = parseInt(elementClicked.parentNode.parentNode.id);
            var ul = "todoUl";

            if (elementClicked.classList.contains("deleteBtn")) {
                var textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromStorage(textValue);
                handlers.deleteTodo(ul, elementParentIdValue);
            }

            if (elementClicked.checked) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
            }

            if (elementClicked.classList.contains("priorityBtn")) {
                handlers.makeTodoPriority(elementParentIdValue);
            }
        });

        this.completedUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var ul = "completedUl";
            var position = elementClicked.parentNode.id.substr(10);

            if (elementClicked.classList.contains("deleteBtn")) {
                var textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromStorage(textValue);
                handlers.deleteTodo(ul, position);
            } else if (!elementClicked.checked) {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

view.setupEventListeners();
lists.retrieveTodosFromStorage();
handlers.displayAllTodos();

//# sourceMappingURL=app-compiled.js.map