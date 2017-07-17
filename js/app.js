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
const lists = {

    // Array of items
    todos          : [],
    priorityTodos : [],
    completedTodos : [],
    localStorageArr: [],

    addAllTodosToLocalStorageArr() {
        this.localStorageArr.splice(0);

        this.todos.forEach( todo => {
            this.localStorageArr.push(todo);
        });

        this.completedTodos.forEach( todo => {
            this.localStorageArr.push(todo);
        });

        console.log(this.localStorageArr);
    },

    // Create method to add todoItems to the list
    addTodo(todoTitle, completed = false, priority = false) {
        this.todos.unshift({
            todoTitle : todoTitle,
            completed : completed,
            priority  : priority,
        });
    },

    addCompletedTodo(todoTitle, completed = true, priority = false){
        this.completedTodos.push({
            todoTitle : todoTitle,
            completed : completed,
            priority  : priority,
        })
    },

    storeTodosInLocalStorage() {
        const storage = localStorage;
        this.localStorageArr.forEach( (todo,position) => {

            let todoObj = {
                title : todo.todoTitle,
                completed : todo.completed,
                priority  : todo.priority,
            };
            storage.setItem(position, JSON.stringify(todoObj));
        })
    },

    retrieveTodosFromStorage(){
        const storage = localStorage;

        Object.keys(storage).forEach( key => {
            let todo = JSON.parse(storage.getItem(key));

            if(todo.completed === false) {
                this.addTodo(todo.title, todo.completed, todo.priority);
            } else {
                this.addCompletedTodo(todo.title, todo.completed, todo.priority);
            }
        });
    },

    removeTodoFromStorage(textValue) {
        const storage = localStorage;

        Object.keys(storage).forEach( key => {
            let title = JSON.parse(storage[key]).title;
            if(title === textValue){
                storage.removeItem(key);
            }
        })
    },

    deletedTodo(ul, position) {
        if(ul === "todoUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },

    clearAllCompletedTodos() {
        this.completedTodos.splice(0);
    },

    makeTodoPriority(position) {
        let todo = this.todos[position];

        if(todo.priority === true) {
            todo.priority = !todo.priority;
        } else {
            let removeTodoFromCurrentPosition = this.todos.splice(position, 1);

            removeTodoFromCurrentPosition.forEach( todo => {
                this.addTodo(todo.todoTitle, todo.completed ,true);
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

    toggleNotCompleted(position) {
        let todo       = this.completedTodos[position];

        this.todos.push({
            todoTitle : todo.todoTitle,
            completed : !todo.completed,
            priority  : todo.priority
        });
    },

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
        view.displayTodos();
        lists.addAllTodosToLocalStorageArr();
        lists.storeTodosInLocalStorage();
    },

    deleteTodo(ul, position){
        lists.deletedTodo(ul, position);
        view.displayTodos();
        view.displayCompletedTodos();
        lists.addAllTodosToLocalStorageArr();
    },

    makeTodoPriority(position){
        lists.makeTodoPriority(position);
        view.displayTodos();
        view.displayCompletedTodos();
        lists.addAllTodosToLocalStorageArr();
        lists.storeTodosInLocalStorage();
    },

    toggleCompleted(ul, position) {
        lists.toggleCompleted(position);
        lists.deletedTodo(ul, position);
        lists.addAllTodosToLocalStorageArr();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },

    toggleNotCompleted(position) {
        lists.toggleNotCompleted(position);
        lists.deletedTodo(null, position);
        lists.addAllTodosToLocalStorageArr();
        lists.storeTodosInLocalStorage();
        view.displayTodos();
        view.displayCompletedTodos();
    },

    displayAllTodos(){
        view.displayTodos();
        view.displayCompletedTodos();
    },

    clearAllCompletedTodos(){
      lists.clearAllCompletedTodos();
    },

    filterPriorityTodos(){
        view.displayPriorityTodos(lists.filterPriorityTodos());
    },

    removeTodoFromStorage(textValue) {
        lists.removeTodoFromStorage(textValue);
    }

};

const view = {
    todoUl      : document.querySelector("#todoUl"),
    completedUl : document.querySelector("#completedUl"),

    displayTodos() {
        this.todoUl.innerHTML = "";
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
            this.todoUl.appendChild(todoLi);
        }, this);
    },

    displayPriorityTodos(priorityTodosList) {
        this.todoUl.innerHTML = "";
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
            this.todoUl.appendChild(todoLi);
        }, this);
    },

    displayCompletedTodos() {
        this.completedUl.innerHTML = "";

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
            this.completedUl.appendChild(completedLi);
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
            }
        });

        toggleAllTodosBtn.addEventListener("click", () => {
            this.todoUl.style.display = "";
            handlers.displayAllTodos();
        });

        clearCompletedTodos.addEventListener("click", () => {
            handlers.clearAllCompletedTodos();
            handlers.displayAllTodos();
        });

        let filterPriorityTodos = () => {
            let priorityTodoList = lists.filterPriorityTodos();
            if(priorityTodoList.length === 0) {
                this.todoUl.classList.remove("priority-active");
                handlers.displayAllTodos();
            } else if (priorityTodoList.length > 0){
                this.todoUl.classList.add("priority-active");
                handlers.filterPriorityTodos();
            }
        };

        filterPriorityTodosBtn.addEventListener("click", filterPriorityTodos);

        this.todoUl.addEventListener("click", event => {
            let elementClicked       = event.target;
            let elementParentIdValue = parseInt(elementClicked.parentNode.parentNode.id);
            let ul                   = "todoUl";

            if(elementClicked.classList.contains("deleteBtn") && this.todoUl.classList.contains("priority-active")) {
                handlers.deleteTodo(ul, elementParentIdValue);
                filterPriorityTodos();
            } else if(elementClicked.classList.contains("deleteBtn")) {
                let textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromStorage(textValue);
                handlers.deleteTodo(ul, elementParentIdValue);
            }

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
        });

        this.completedUl.addEventListener("click", event => {
            let elementClicked = event.target;
            let ul             = "completedUl";
            let position       = elementClicked.parentNode.id.substr(10);

            if(elementClicked.classList.contains("deleteBtn")){
                let textValue = elementClicked.parentNode.parentNode.childNodes[1].textContent;
                handlers.removeTodoFromStorage(textValue);
                handlers.deleteTodo(ul, position);
            } else if(!elementClicked.checked) {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

view.setupEventListeners();
lists.retrieveTodosFromStorage();
handlers.displayAllTodos();
