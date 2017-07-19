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
const lists = {

    // Init the app
    appInit() {
        view.setupEventListeners();
        lists.retrieveTodosFromStorage();
        handlers.displayAllTodos();
    },

    // This method checks the localStorage for stored todos and displays them when app is initiated.
    retrieveTodosFromStorage(){
        const storage = localStorage;

        if(storage.length > 0) {
            Object.keys(storage).forEach(key => {
                let todo = JSON.parse(storage.getItem(key));

                if(todo.completed === false) {
                    this.addTodo(todo.title, todo.completed, todo.priority);
                } else {
                    this.addCompletedTodo(todo.title, todo.completed, todo.priority);
                }
            });
        }
    },

    // Arrays
    todos          : [],
    priorityTodos : [],
    completedTodos : [],
    storageArray: [],

    pushAllTodosInStorageArray() {
        this.storageArray.splice(0);

        this.todos.forEach( todo => {
            this.storageArray.push(todo);
        });

        this.completedTodos.forEach( todo => {
            this.storageArray.push(todo);
        });
    },

    // This method saves all the todos found in the storageArray into the Browsers localStorage Object.
    storeTodosInLocalStorage() {
        const storage = localStorage;
        storage.clear();

        this.storageArray.forEach( (todo,position) => {

            let todoObj = {
                title : todo.todoTitle,
                completed : todo.completed,
                priority  : todo.priority,
            };
            storage.setItem(position, JSON.stringify(todoObj));
        })
    },

    // Create method to add todos to the todos list.
    addTodo(todoTitle, completed = false, priority = false) {
        this.todos.unshift({
            todoTitle : todoTitle,
            completed : completed,
            priority  : priority,
        });
    },
    // Method which add todos to the completed todos list.
    addCompletedTodo(todoTitle, completed = true, priority = false){
        this.completedTodos.push({
            todoTitle : todoTitle,
            completed : completed,
            priority  : priority,
        })
    },

    // Method which will remove the todos, passed as a parameter, from the localStorageObj.
    removeTodoFromLocalStorageObj(textValue) {
        const storage = localStorage;

        if(Array.isArray(textValue)){
            textValue.forEach(todo =>{
                Object.keys(storage).forEach( key => {
                    let title = JSON.parse(storage[key]).title;
                    if(title === todo){
                        storage.removeItem(key);
                    }
                })
            })
        } else {
            Object.keys(storage).forEach(key => {
                let title = JSON.parse(storage[key]).title;
                if(title === textValue) {
                    storage.removeItem(key);
                }
            })
        }
    },

    // This method return an array of all the todos in the completedTodos array. This array will be passed as parameter
    // to the removeTodoFromLocalStorageObj to remove them from the Browsers localStorage Obj.
    clearAllCompletedTodos() {
        let arr = [];
        this.completedTodos.forEach( (todo) => {
            arr.push(todo.todoTitle);
        });
        this.completedTodos.splice(0);
        return arr;
    },

    // Method which will delete todos from the todos or the completedTodos array.
    deletedTodo(ul, position) {
        if(ul === "todoUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },

    // This method will change the todos priority status.
    makeTodoPriority(position) {
        let todo = this.todos[position];

        if(todo.priority === true) {
            todo.priority = !todo.priority;
        } else {
            let removeTodoFromCurrentPosition = this.todos.splice(position, 1);     // Removes the todoItem from its current position in the todosArray.

            removeTodoFromCurrentPosition.forEach( todo => {
                this.addTodo(todo.todoTitle, todo.completed ,true);                 // Insert the todoItem at the beginning of the todosArray by calling the addTodo method.
            }, this);
        }
    },

    // Create method to mark todoItems as completed in the list
    toggleCompleted(position) {
        let todo       = this.todos[position];

        this.completedTodos.unshift({
            todoTitle : todo.todoTitle,
            completed : !todo.completed,
            priority  : todo.priority
        });
    },

    // Create method to mark todos as NOTcompleted in the list.
    toggleNotCompleted(position) {
        let todo       = this.completedTodos[position];

        this.todos.push({
            todoTitle : todo.todoTitle,
            completed : !todo.completed,
            priority  : todo.priority
        });
    },

    // Checks the priority property of each todoItem and if value === true, those todos will be pushed to the priorityTodos aaray.
    filterPriorityTodos(){
       return this.todos.filter( todo => {
            if(todo.priority !== false) {
               return this.priorityTodos.unshift({
                    todoTitle : todo.todoTitle,
                    completed : todo.completed,
                    priority  : todo.priority
                });
            }
        });
    },
};

// Handlers for the events the user triggers.
const handlers = {

    addTodo(value) {
        lists.addTodo(value);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
    },

    deleteTodo(ul, position){
        lists.deletedTodo(ul, position);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },

    makeTodoPriority(position){
        lists.makeTodoPriority(position);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },

    toggleCompleted(ul, position) {
        lists.toggleCompleted(position);
        lists.deletedTodo(ul, position);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },

    toggleNotCompleted(position) {
        lists.toggleNotCompleted(position);
        lists.deletedTodo(null, position);
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },

    displayAllTodos(){
        view.displayTodos();
        view.displayCompletedTodos();
    },

    clearAllCompletedTodos(){
        lists.removeTodoFromLocalStorageObj(lists.clearAllCompletedTodos());
        lists.pushAllTodosInStorageArray();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },

    filterPriorityTodos(){
        view.displayPriorityTodos(lists.filterPriorityTodos());
    },

    removeTodoFromLocalStorageObj(textValue) {
        lists.removeTodoFromLocalStorageObj(textValue);
    }
};

const view = {
    todoUl      : document.querySelector("#todoUl"),
    completedUl : document.querySelector("#completedUl"),

    displayTodos() {
        let todoUl = this.todoUl;
        todoUl.innerHTML = "";
        this.completedUl.style.display = "";

        lists.todos.forEach((todo, position) => {
            let todoLi         = document.createElement("li");
            let textNode = document.createTextNode(todo.todoTitle);
            todoLi.id          = position;
            todoLi.appendChild(textNode);
            todoLi.prepend(this.createCheckBox());
            let btnDiv = this.createBtnDiv();

            if(todo.priority === false){
                btnDiv.appendChild(this.createPriorityInitialIcon());
            } else {
                btnDiv.appendChild(this.createPriorityIcon());
            }

            btnDiv.appendChild(this.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            todoUl.appendChild(todoLi);
        }, this);
    },

    displayPriorityTodos(priorityTodosList) {
        let todoUl = this.todoUl;
        todoUl.innerHTML = "";
        todoUl.classList.add("priority-active");
        this.completedUl.style.display = "none";

        priorityTodosList.forEach( (todo, position) => {
            let todoLi         = document.createElement("li");
            let textNode = document.createTextNode(todo.todoTitle);
            todoLi.id          = position;
            todoLi.appendChild(textNode);
            todoLi.prepend(this.createCheckBox());
            let btnDiv = this.createBtnDiv();

            btnDiv.appendChild(this.createPriorityIcon());
            btnDiv.appendChild(this.createDeleteIcon());
            todoLi.appendChild(btnDiv);
            todoUl.appendChild(todoLi);
        }, this);
    },

    displayCompletedTodos() {
        let completedUl = this.completedUl;
        completedUl.innerHTML = "";

        lists.completedTodos.forEach( (todo, position) => {
            let completedLi         = document.createElement("li");
            let textNode = document.createTextNode(todo.todoTitle);
            completedLi.id          = `completed-${position}`;
            completedLi.appendChild(textNode);
            let checkbox = this.createCheckBox();
            checkbox.checked = true;
            completedLi.prepend(checkbox);

            let btnDiv = this.createBtnDiv();
            btnDiv.appendChild(this.createDeleteIcon());

            completedLi.appendChild(btnDiv);
            completedUl.appendChild(completedLi);
        }, this);
    },

    createBtnDiv(){
        let btnDiv = document.createElement("div");
        btnDiv.className = "btnDiv";
        return btnDiv;
    },

    createDeleteIcon() {
        let deleteBtn = document.createElement("i");
        deleteBtn.classList.add("deleteBtn","fa", "fa-trash-o","fa-fw", "fa-2x");
        deleteBtn.setAttribute("aria-hidden","true");
        return deleteBtn;
    },

    createCheckBox() {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkBox";
        return checkbox;
    },

    createPriorityInitialIcon() {
        let priorityBtn = document.createElement("i");
        priorityBtn.classList.add("priorityBtn","fa","fa-star-o","fa-fw","fa-2x");
        priorityBtn.setAttribute("aria-hidden","true");
        return priorityBtn;
    },

    createPriorityIcon() {
        let priorityBtn = document.createElement("i");
        priorityBtn.classList.add("priorityBtn","fa","fa-star","fa-fw","fa-2x");
        priorityBtn.setAttribute("aria-hidden","true");
        return priorityBtn;
    },

    setupEventListeners() {
        let addTodoInputValue = document.querySelector("#addTodoValueInput");
        let toggleAllTodosBtn = document.querySelector(".toggleAllTodos");
        let filterPriorityTodosBtn = document.querySelector(".togglePriorityTodos");
        let clearCompletedTodos =  document.querySelector(".clearCompletedTodos");

        addTodoInputValue.addEventListener("keyup", event => {
            if(event.key === "Enter" && addTodoInputValue.value !== ""){
                handlers.addTodo(addTodoInputValue.value);
                addTodoInputValue.value = "";
                this.todoUl.classList.remove("priority-active");
            }
        });

        toggleAllTodosBtn.addEventListener("click", () => {
            this.todoUl.style.display = "";
            this.todoUl.classList.remove("priority-active");
            handlers.displayAllTodos();
        });

        clearCompletedTodos.addEventListener("click", () => {
            handlers.clearAllCompletedTodos();
        });

        let filterPriorityTodos = () => {
            let priorityTodoList = lists.filterPriorityTodos();
            if(priorityTodoList.length === 0) {
                this.todoUl.classList.remove("priority-active");
                handlers.displayAllTodos();
            } else if (priorityTodoList.length > 0){
                handlers.filterPriorityTodos();
            }
        };

        filterPriorityTodosBtn.addEventListener("click", filterPriorityTodos);

        this.todoUl.addEventListener("click", event => {
            let elementClicked       = event.target;
            let elementParentIdValue = parseInt(elementClicked.parentNode.parentNode.id);
            let ul                   = "todoUl";

            if(elementClicked.checked && this.todoUl.classList.contains("priority-active")) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
                filterPriorityTodos();
            } else if(elementClicked.checked) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
            }

            if(elementClicked.classList.contains("priorityBtn") && this.todoUl.classList.contains("priority-active")) {
                handlers.makeTodoPriority(elementParentIdValue);
                filterPriorityTodos();
            } else if(elementClicked.classList.contains("priorityBtn")){
                handlers.makeTodoPriority(elementParentIdValue);
            }

            if(elementClicked.classList.contains("deleteBtn") && this.todoUl.classList.contains("priority-active")) {
                handlers.deleteTodo(ul, elementParentIdValue);
                filterPriorityTodos();
            }else if(elementClicked.classList.contains("deleteBtn")){
                let textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromLocalStorageObj(textValue);
                handlers.deleteTodo(ul, elementParentIdValue);
            }
        });

        this.completedUl.addEventListener("click", event => {
            let elementClicked = event.target;
            let ul             = "completedUl";
            let position       = elementClicked.parentNode.id.substr(10);

            if(elementClicked.classList.contains("deleteBtn")){
                let textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromLocalStorageObj(textValue);
                handlers.deleteTodo(ul, position);
            } else if(!elementClicked.checked) {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

// Run the app
lists.appInit();
