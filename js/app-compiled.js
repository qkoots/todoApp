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

    // Init the app
    appInit: function appInit() {
        view.setupEventListeners();
        lists.retrieveTodosFromStorage();
        handlers.displayAllTodos();
    },


    // This method checks the localStorage for stored todos and displays them when app is initiated.
    retrieveTodosFromStorage: function retrieveTodosFromStorage() {
        var _this = this;

        var storage = localStorage;

        if (storage.length > 0) {
            Object.keys(storage).forEach(function (key) {
                var todo = JSON.parse(storage.getItem(key));

                if (todo.completed === false) {
                    _this.addTodo(todo.title, todo.completed, todo.priority);
                } else {
                    _this.addCompletedTodo(todo.title, todo.completed, todo.priority);
                }
            });
        }
    },


    // Arrays
    todos: [],
    priorityTodos: [],
    completedTodos: [],
    storageArray: [],

    pushAllTodosInStorageArray: function pushAllTodosInStorageArray() {
        var _this2 = this;

        this.storageArray.splice(0);

        this.todos.forEach(function (todo) {
            _this2.storageArray.push(todo);
        });

        this.completedTodos.forEach(function (todo) {
            _this2.storageArray.push(todo);
        });
    },


    // This method saves all the todos found in the storageArray into the Browsers localStorage Object.
    storeTodosInLocalStorage: function storeTodosInLocalStorage() {
        var storage = localStorage;
        storage.clear();

        this.storageArray.forEach(function (todo, position) {

            var todoObj = {
                title: todo.todoTitle,
                completed: todo.completed,
                priority: todo.priority
            };
            storage.setItem(position, JSON.stringify(todoObj));
        });
    },


    // Create method to add todos to the todos list.
    addTodo: function addTodo(todoTitle) {
        var completed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.todos.unshift({
            todoTitle: todoTitle,
            completed: completed,
            priority: priority
        });
    },

    // Method which add todos to the completed todos list.
    addCompletedTodo: function addCompletedTodo(todoTitle) {
        var completed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        this.completedTodos.push({
            todoTitle: todoTitle,
            completed: completed,
            priority: priority
        });
    },


    // Method which will remove the todos, passed as a parameter, from the localStorageObj.
    removeTodoFromLocalStorageObj: function removeTodoFromLocalStorageObj(textValue) {
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


    // This method return an array of all the todos in the completedTodos array. This array will be passed as parameter
    // to the removeTodoFromLocalStorageObj to remove them from the Browsers localStorage Obj.
    clearAllCompletedTodos: function clearAllCompletedTodos() {
        var arr = [];
        this.completedTodos.forEach(function (todo) {
            arr.push(todo.todoTitle);
        });
        this.completedTodos.splice(0);
        return arr;
    },


    // Method which will delete todos from the todos or the completedTodos array.
    deletedTodo: function deletedTodo(ul, position) {
        if (ul === "todoUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },


    // This method will change the todos priority status.
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


    // Create method to mark todos as NOTcompleted in the list.
    toggleNotCompleted: function toggleNotCompleted(position) {
        var todo = this.completedTodos[position];

        this.todos.push({
            todoTitle: todo.todoTitle,
            completed: !todo.completed,
            priority: todo.priority
        });
    },


    // Checks the priority property of each todoItem and if value === true, those todos will be pushed to the priorityTodos aaray.
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
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    makeTodoPriority: function makeTodoPriority(position) {
        lists.makeTodoPriority(position);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    toggleCompleted: function toggleCompleted(ul, position) {
        lists.toggleCompleted(position);
        lists.deletedTodo(ul, position);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    toggleNotCompleted: function toggleNotCompleted(position) {
        lists.toggleNotCompleted(position);
        lists.deletedTodo(null, position);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    displayAllTodos: function displayAllTodos() {
        view.displayTodos();
        view.displayCompletedTodos();
    },
    clearAllCompletedTodos: function clearAllCompletedTodos() {
        lists.removeTodoFromLocalStorageObj(lists.clearAllCompletedTodos());
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },
    filterPriorityTodos: function filterPriorityTodos() {
        view.displayPriorityTodos(lists.filterPriorityTodos());
    },
    removeTodoFromLocalStorageObj: function removeTodoFromLocalStorageObj(textValue) {
        lists.removeTodoFromLocalStorageObj(textValue);
    }
};

var view = {
    todoUl: document.querySelector("#todoUl"),
    completedUl: document.querySelector("#completedUl"),

    displayTodos: function displayTodos() {
        var _this5 = this;

        var todoUl = this.todoUl;
        todoUl.innerHTML = "";
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
            todoUl.appendChild(todoLi);
        }, this);
    },
    displayPriorityTodos: function displayPriorityTodos(priorityTodosList) {
        var _this6 = this;

        var todoUl = this.todoUl;
        todoUl.innerHTML = "";
        todoUl.classList.add("priority-active");
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
            todoUl.appendChild(todoLi);
        }, this);
    },
    displayCompletedTodos: function displayCompletedTodos() {
        var _this7 = this;

        var completedUl = this.completedUl;
        completedUl.innerHTML = "";

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
            completedUl.appendChild(completedLi);
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
                _this8.todoUl.classList.remove("priority-active");
            }
        });

        toggleAllTodosBtn.addEventListener("click", function () {
            _this8.todoUl.style.display = "";
            _this8.todoUl.classList.remove("priority-active");
            handlers.displayAllTodos();
        });

        clearCompletedTodos.addEventListener("click", function () {
            handlers.clearAllCompletedTodos();
        });

        var filterPriorityTodos = function filterPriorityTodos() {
            var priorityTodoList = lists.filterPriorityTodos();
            if (priorityTodoList.length === 0) {
                _this8.todoUl.classList.remove("priority-active");
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

            if (elementClicked.checked && _this8.todoUl.classList.contains("priority-active")) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
                filterPriorityTodos();
            } else if (elementClicked.checked) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
            }

            if (elementClicked.classList.contains("priorityBtn") && _this8.todoUl.classList.contains("priority-active")) {
                handlers.makeTodoPriority(elementParentIdValue);
                filterPriorityTodos();
            } else if (elementClicked.classList.contains("priorityBtn")) {
                handlers.makeTodoPriority(elementParentIdValue);
            }

            if (elementClicked.classList.contains("deleteBtn") && _this8.todoUl.classList.contains("priority-active")) {
                handlers.deleteTodo(ul, elementParentIdValue);
                filterPriorityTodos();
            } else if (elementClicked.classList.contains("deleteBtn")) {
                var textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromLocalStorageObj(textValue);
                handlers.deleteTodo(ul, elementParentIdValue);
            }
        });

        this.completedUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            var ul = "completedUl";
            var position = elementClicked.parentNode.id.substr(10);

            if (elementClicked.classList.contains("deleteBtn")) {
                var textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromLocalStorageObj(textValue);
                handlers.deleteTodo(ul, position);
            } else if (!elementClicked.checked) {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

// Run the app
lists.appInit();

//# sourceMappingURL=app-compiled.js.map