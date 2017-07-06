// Create a method which will mark item as priority by clicking on i.e. a Star-icon.
// When user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
// Create a function so items in the completed list can be pushed back to the todoListUl (i.e when user accidentally click complete button).
// Line-through the completedTasks text (text-decoration prop CSS).
// Add item to task list by pressing enterKey.
//TODO View option to only see the priority items.
//Empty input form after items has been added.
//TODO integrate search method to search for specific items.
//TODO Search should ignore case-sensitivity.
//TODO Integrate Web Storage API to save data in the Storage object(localStorage).
//TODO Task in LocalStorage that has the data-attr = priority, should render as priority task when page is refresh/reload/visited again.
//TODO Task in LocalStorage that has already been completed should be rendered in the completedListUl when page is refresh/reload/visited again.
//TODO Program should save the specific date a task was created.
//TODO Program should save the specific date a task was completed.
//TODO Replace icons using font awesome icons.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date

// Construct the lists object
const lists = {

    // Array of items
    todos          : [],
    completedTodos : [],

    // Create method to add todoItems to the list
    addTodo (todoTitle, priority = false) {
        this.todos.unshift({
            todoTitle : todoTitle,
            completed : false,
            priority  : priority,
        });
    },

    deletedTodo (ul, position) {
        if(ul === "todoUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },

    makeTodoPriority (position) {
        let todo = this.todos[position];

        if(todo.priority === true) {
            todo.priority = !todo.priority;
        } else {
            let removeTodoFromCurrentPosition = this.todos.splice(position, 1);

            removeTodoFromCurrentPosition.forEach(todo => {
                this.addTodo(todo.todoTitle, true);
            }, this);
        }
    },

    // Create method to mark todoItems as completed in the list
    toggleCompleted (position) {
        let todo       = this.todos[position];
        todo.completed = !todo.completed;

        this.completedTodos.unshift({
            todoTitle : todo.todoTitle,
            completed : todo.completed,
            priority  : todo.priority
        });
    },

    toggleNotCompleted (position) {
        let todo       = this.completedTodos[position];
        todo.completed = false;

        this.todos.push({
            todoTitle : todo.todoTitle,
            completed : todo.completed,
            priority  : todo.priority
        });
    },
};

// Handlers for the events the user triggers.
const handlers = {

    addTodo(value) {
        lists.addTodo(value);
        view.displayTodos();
    },

    deleteTodo(ul, position){
        lists.deletedTodo(ul, position);
        view.displayTodos();
        view.displayCompletedTodos();
    },

    makeTodoPriority(position){
        lists.makeTodoPriority(position);
        view.displayTodos();
        view.displayCompletedTodos();
    },

    toggleCompleted(ul, position) {
        lists.toggleCompleted(position);
        lists.deletedTodo(ul, position);
        view.displayTodos();
        view.displayCompletedTodos();
    },

    toggleNotCompleted(position) {
        lists.toggleNotCompleted(position);
        lists.deletedTodo(null, position);
        view.displayTodos();
        view.displayCompletedTodos();
    },
};

const view = {
    todoUl      : document.querySelector("#todoUl"),
    completedUl : document.querySelector("#completedUl"),

    displayTodos() {
        this.todoUl.innerHTML = "";

        lists.todos.forEach((todo, position) => {
            let todoLi         = document.createElement("li");
            todoLi.id          = position;
            todoLi.textContent = todo.todoTitle;
            todoLi.prepend(this.createCheckBox());

            let btnDiv = this.createBtnDiv();
            btnDiv.appendChild(this.createPriorityBtn());
            btnDiv.appendChild(this.createDeleteBtn());

            todoLi.appendChild(btnDiv);
            //todoLi.appendChild();
            this.todoUl.appendChild(todoLi);
        }, this);
    },

    displayCompletedTodos() {
        this.completedUl.innerHTML = "";

        lists.completedTodos.forEach((todo, position) => {
            let completedLi         = document.createElement("li");
            completedLi.id          = `completed-${position}`;
            completedLi.textContent = todo.todoTitle;
            todo.completed          = !todo.completed;
            let checkbox = this.createCheckBox();
            checkbox.checked = true;
            completedLi.prepend(checkbox);

            let btnDiv = this.createBtnDiv();
            btnDiv.appendChild(this.createDeleteBtn());

            completedLi.appendChild(btnDiv);
            this.completedUl.appendChild(completedLi);
        }, this);
    },

    createBtnDiv(){
        let btnDiv = document.createElement("div");
        btnDiv.className = "btnDiv";
        return btnDiv;
    },

    createDeleteBtn() {
        let deleteBtn         = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className   = "deleteBtn";
        return deleteBtn;
    },

    createCheckBox() {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkBox";
        return checkbox;
    },

    createPriorityBtn() {
        let priorityBtn         = document.createElement("button");
        priorityBtn.textContent = "Priority";
        priorityBtn.className   = "priorityBtn";
        return priorityBtn;
    },

    setupEventListeners() {

        let addTodoInputValue = document.getElementById("addTodoValueInput");

        addTodoInputValue.addEventListener("keyup", (event) => {
            if(event.key === "Enter" && addTodoInputValue.value !== ""){
                handlers.addTodo(addTodoInputValue.value);
                addTodoInputValue.value = "";
            }
        });

        this.todoUl.addEventListener("click", event => {
            let elementClicked       = event.target;
            let elementParentIdValue = parseInt(elementClicked.parentNode.parentNode.id);
            let ul                   = "todoUl";

            if(elementClicked.className === "deleteBtn") {
                handlers.deleteTodo(ul, elementParentIdValue);
            } else if(elementClicked.checked) {
                handlers.toggleCompleted(ul, parseInt(elementClicked.parentNode.id));
            } else if(elementClicked.className === "priorityBtn") {
                handlers.makeTodoPriority(elementParentIdValue);
            }
        });

        this.completedUl.addEventListener("click", event => {
            let elementClicked = event.target;
            let ul             = "completedUl";
            let position       = elementClicked.parentNode.id.substr(10);

            if(elementClicked.className === "deleteBtn") {
                handlers.deleteTodo(ul, position);
            } else if(!elementClicked.checked) {
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

view.setupEventListeners();

