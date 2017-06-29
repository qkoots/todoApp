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
const lists = {

    // Array of items
    todos          : [],
    completedTodos : [],

    // Create method to add todoItems to the list
    addTodo(todoTitle, priority = false) {
        this.todos.unshift({
            todoTitle : todoTitle,
            completed : false,
            priority  : priority,
        });
    },

    deletedTodo(ul, position) {
        if(ul === "todoUl") {
            this.todos.splice(position, 1);
        } else {
            this.completedTodos.splice(position, 1);
        }
    },

    makeTodoPriority(position){
        let todo = this.todos[position];

        if(todo.priority === true) {
             todo.priority = !todo.priority;
        } else {
            let removeTodoFromCurrentPosition = this.todos.splice(position, 1);

            removeTodoFromCurrentPosition.forEach(todo=> {
                this.addTodo(todo.todoTitle, true);
            }, this);
        }
    },

    // Create method to mark todoItems as completed in the list
    toggleCompleted(position) {
        let todo       = this.todos[position];
        todo.completed = !todo.completed;

        this.completedTodos.unshift({
            todoTitle : todo.todoTitle,
            completed : todo.completed,
            priority  : todo.priority
        });
    },

    toggleNotCompleted(position) {
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

    addTodo() {
        let addTodoInputValue = document.getElementById("addTodoValueInput");
        lists.addTodo(addTodoInputValue.value);
        addTodoInputValue.value = "";
        view.displayTodos();
    },

    deleteTodo(ul,position){
        lists.deletedTodo(ul,position);
        view.displayTodos();
        view.displayCompletedTodos();
    },

    makeTodoPriority(position){
        lists.makeTodoPriority(position);
        view.displayTodos();
        view.displayCompletedTodos();
    },

    toggleCompleted(ul,position) {
        lists.toggleCompleted(position);
        lists.deletedTodo(ul,position);
        view.displayTodos();
        view.displayCompletedTodos();
    },

    toggleNotCompleted(position) {
        lists.toggleNotCompleted(position);
        lists.deletedTodo(null,position);
        view.displayTodos();
        view.displayCompletedTodos();
    },
};

const view = {
    todoUl : document.querySelector("#todoUl"),
    completedUl: document.querySelector("#completedUl"),

    displayTodos() {
        this.todoUl.innerHTML = "";

        lists.todos.forEach((todo,position) => {
            let todoLi = document.createElement("li");
            todoLi.id = position;
            todoLi.textContent = todo.todoTitle;
            todoLi.appendChild(this.createDeleteBtn());
            todoLi.appendChild(this.createPriorityBtn());
            todoLi.appendChild(this.createCompleteBtn());
            this.todoUl.appendChild(todoLi);
        }, this);
    },

    displayCompletedTodos() {
        this.completedUl.innerHTML = "";
        
        lists.completedTodos.forEach((todo,position) => {
            let completedLi = document.createElement("li");
            completedLi.id = `completed-${position}`;
            completedLi.textContent = todo.todoTitle;
            todo.completed = !todo.completed;
            completedLi.appendChild(this.createDeleteBtn());
            completedLi.appendChild(this.createNotCompleteBtn());
            this.completedUl.appendChild(completedLi);
        },this);
    },

    createDeleteBtn() {
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "deleteBtn";
        return deleteBtn;
    },

    createCompleteBtn() {
        let completedBtn = document.createElement("button");
        completedBtn.textContent = "Complete";
        completedBtn.className ="completedBtn";
        return completedBtn;
    },

    createPriorityBtn() {
        let priorityBtn = document.createElement("button");
        priorityBtn.textContent = "Priority";
        priorityBtn.className = "priority";
        return priorityBtn;
    },

    createNotCompleteBtn() {
        let notCompletedBtn = document.createElement("button");
        notCompletedBtn.textContent = "Mark as Todo";
        notCompletedBtn.className ="notCompletedBtn";
        return notCompletedBtn;
    },

    setupEventListeners() {
        this.todoUl.addEventListener("click", event => {
            let elementClicked = event.target;
            let ul = "todoUl";

            if(elementClicked.className === "deleteBtn"){
                handlers.deleteTodo(ul,parseInt(elementClicked.parentNode.id));
            } else if(elementClicked.className === "completedBtn"){
                handlers.toggleCompleted(ul,parseInt(elementClicked.parentNode.id));
            } else if(elementClicked.className === "priority"){
                handlers.makeTodoPriority(parseInt(elementClicked.parentNode.id));
            }
        });

        this.completedUl.addEventListener("click", event => {
            let elementClicked = event.target;
            let ul = "completedUl";
            let position = elementClicked.parentNode.id.substr(10);

            if(elementClicked.className === "deleteBtn"){
                handlers.deleteTodo(ul,position);
            } else if(elementClicked.className === "notCompletedBtn"){
                handlers.toggleNotCompleted(position);
            }
        });
    }
};

view.setupEventListeners();

