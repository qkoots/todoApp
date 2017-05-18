
// create a priority tasks list which will push items in it by clicking on i.e. a Star-icon.
// when user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
// create a function so items in the completed list can be pushed back to the todoListUl (i.e when user accidentally click complete button).
// line-through the completedTasks text (text-decoration prop CSS).
// Add item to task list by pressing enterKey.
// View option to only see the priority items.
// Empty input form after items has been added.
// Display date when task was send to completed list.
// integrate search method to search for specific items.
// Search should ignore case-sensitivity.
// Integrate Web Storage API to save data in the Storage object(localStorage).
//Task in LocalStorage that has the data-attr = priority, should render as priority task when page is refresh/reload/visited again.
//Task in LocalStorage that has already been completed should be rendered in the completedListUl when page is refresh/reload/visited again.

//TODO The priorityBtn of tasks in completedListUl should not be displayed when page is refresh/reloaded.
//TODO button the Clear all tasks. The user should confirm this action before the program runs the function.
//TODO Program should save the specific date a task was created.
//TODO Program should save the specific date a task was completed.
//TODO Replace icons using font awesome icons.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date


$(()=>{

    // Saving the DOM elements in a variables
    let addBtn =  document.getElementById("addBtn");
    let todoListUl = document.getElementById("todolistUl");
    let completeListUl = document.getElementById("completedListUl");
    let input = document.getElementById("userInput");
    const priorityListToggleBtn = document.getElementById("priorityListBtn");
    let searchFieldInput = document.getElementById("searchInputField");

    // Click event listener that will get the value from the input form,
    // check if it is not empty, call the addItem function passing the input value as an argument.
    addBtn.addEventListener("click", () => {
        let text = input.value;
        text ? addItem(text) : console.log("No user input");
    });

    // Event listener that will get the value from the input form when the enterKey is pressed,
    // check if it is not empty, call the addItem function passing the input value as an argument.
    input.addEventListener("keyup", e => {
        if(e.keyCode === 13){
            let text = input.value;
            text ? addItem(text, getDate()) : console.log("No user input");
        }
    });

    // This function will check if item has the data-level attr when a user triggers the event(priorityBtn).
    // If true, it will be removed and invoke hidePriorityToggleBtn.
    // If false, markAsPriority function will be invoked
    const checkPriorityLevel = e => {
        let item = e.target.parentNode.parentNode;
        if(item.getAttribute("data-level") === "priority"){
            item.removeAttribute("data-level");
            item.classList.remove("priority-item");
            hidePriorityToggleBtn(todoListUl);
            prepToStoreTodoList(todoListUl)
        }else {
            markAsPriority(item);
        }
    };

    // This function will apply data attr value of priority to the task and moves it
    // top off the todolist. Then applies specific CSS styles for task labeled as priority and invoke showPriorityViewToggleBtn.
    const markAsPriority = item => {
        item.setAttribute("data-level","priority");
        item.classList.add("priority-item");
        let parent = item.parentNode;
        item.parentNode.insertBefore(item,parent.childNodes[0]);
        showPriorityViewToggleBtn();
        prepToStoreTodoList(todoListUl);
    };

    // This function will show the priorityListToggleBtn that will only show tasks labeled
    // as priority (if there is 1 or more task with labeled as priority) and adds an event listener to the button.
    const showPriorityViewToggleBtn = () => {
        for(let i = 0 ; i < todoListUl.children.length; i++) {
            if(todoListUl.children[i].getAttribute("data-level") === "priority") {
                priorityListToggleBtn.style.display = "inline-block";
            }

        }
        // Add event listener to the priorityListToggleBtn so showPriorityLabeledItems function can be invoked if button is clicked.
        priorityListToggleBtn.addEventListener("click",showPriorityLabeledItems);
    };

    // This function loops the items in todoListUl and hides tasks that are not labeled as priority.
    // ot also hides the completedListUl.
    const showPriorityLabeledItems = () => {
        for(let i = 0 ; i < todoListUl.children.length; i++) {
            if(todoListUl.children[i].getAttribute("data-level") === null) {
                todoListUl.children[i].style.display = "none";
            }
        }
        // hides the entire completed list
        completeListUl.style.display = "none";

        // Changes the text of the button when in priority view.
        priorityListToggleBtn.textContent = "View All";

        // Add event listener to the priorityListToggleBtn so showAlltems function can be invoked if button is clicked.
        priorityListToggleBtn.addEventListener("click",showAllItems);
    };

    // This function will display all task in the todolistUl(normal state).
    const showAllItems = () => {
        for(let i = 0 ; i < todoListUl.children.length; i++) {
            if(todoListUl.children[i].getAttribute("data-level") === null) {
                todoListUl.children[i].style.display = "";
            }
        }
        // Changes the text of the button when all tasks are displayed.
        priorityListToggleBtn.textContent = "Priorities";

        // Remove the event listener from the button
        priorityListToggleBtn.removeEventListener("click",showAllItems);

        // Adds event listener back to the PriorityList button which completes the Toggle function of the button.
        priorityListToggleBtn.addEventListener("click",showPriorityLabeledItems);

        // Displays the entire completed list
        completeListUl.style.display = "";
    };

    // This function will hide the priorityListToggleBtn (if there is NO task in todoListUl labeled as priority).
    const hidePriorityToggleBtn = (list) => {

        // counter keeping track of how many task in the list have the data-level attribute.
        let count = 0;

        for(let i = 0 ; i < list.children.length; i++) {
            if(list.children[i].getAttribute("data-level") !== null){
                count++;
            }
        }

        if(count >= 1) {
            priorityListToggleBtn.style.display = "inline-block";
        }else {
            priorityListToggleBtn.style.display = "none";
        }
    };

    // Function that will delete the task from the todolistUl/completedListUl.
    const deleteItem = e => {
        let item = e.target.parentNode.parentNode;
        let parent = item.parentNode;
        parent.removeChild(item);

        hidePriorityToggleBtn(todoListUl);

        prepToStoreTodoList(todoListUl);
        prepToStoreCompletedList(completeListUl);
    };

    // Function that will remove task from the todolistUl and moves it to the completedListUl and invoke hidePriorityBtn function.
    const completedItem = e => {
        let item = e.target.parentNode.parentNode;
        let parent = item.parentNode;
        item.children[1].textContent = `Completed on: ${getDate()}`;

        if(parent.getAttribute("id") !== "completedListUl"){
            completeListUl.insertBefore(parent.removeChild(item), completeListUl.childNodes[0]);
            item.classList.add("complete");
            hidePriorityBtn(e);
            prepToStoreCompletedList(completeListUl);
            prepToStoreTodoList(todoListUl);
        }else {
            todoListUl.appendChild(item);
            item.classList.remove("complete");
            item.style.textDecoration = "";
            displayPriorityBtn(e);
            prepToStoreTodoList(todoListUl);
            prepToStoreCompletedList(completeListUl);
        }

        hidePriorityToggleBtn(todoListUl);
    };

    // Function will display the priority button when task is moved back from "completedtaskList" to the todolist.
    const displayPriorityBtn = e => {
        let item = e.target.parentNode;
        let parent = item.parentNode;
        const priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "inline-block";
    };

    // Function will hide the priority button when task is moved to the completedtasklist.
    const hidePriorityBtn = e => {
        let item = e.target.parentNode;
        let parent = item.parentNode;
        const priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "none";
    };

    //Function that gets the current date.
    const getDate = () => {
        const date     = new Date();
        let getDate  = date.toDateString();
        return getDate;
    };

    // Function that will add task to the todolist. The parameter passed to the function is received from the addBtn eventlistener
    // or from the getStorageItem IIFE.
    let addItem = (text ,spanTag, dataAttr, classAttr) =>{

        // Creates an li element and set the id attribute
        const item = document.createElement("li");
        item.setAttribute("class","item");

        // Creates a pElement, appends the text (value) to the pElement and then appends the pElement to the li element.
        const textEl = document.createElement("p");
        const textNode =  document.createTextNode(text);
        textEl.appendChild(textNode);
        item.appendChild(textEl);

        // Creates the Date indicator and appends it to the li element.
        const dateSpan = document.createElement("span");
        const dateNode = document.createTextNode("Created on: "+ getDate());
        dateSpan.appendChild(dateNode);
        dateSpan.className = "dateSpan";
        item.appendChild(dateSpan);

        // Creates a Div element for the remove and complete buttons for every task in the todolist.
        const buttonsDiv     = document.createElement("div");
        buttonsDiv.className = "buttonsDiv";

        // Creates the priority button so tasks can be labeled as priority. Button will be appended as a child to the buttonDiv element.
        const priorityBtn      = document.createElement("button");
        const priorityBtnNode  = document.createTextNode("*");
        priorityBtn.classList.add("btn", "btn-info");
        priorityBtn.setAttribute("id", "priorityBtn");
        priorityBtn.appendChild(priorityBtnNode);
        buttonsDiv.appendChild(priorityBtn);

        // Creates the remove button to remove tasks from the todolist. Button will be appended as a child to the buttonDiv element.
        const removeBtn      = document.createElement("button");
        const removeBtnNode  = document.createTextNode("X");
        removeBtn.classList.add("btn", "btn-danger");
        removeBtn.setAttribute("id", "removeBtn");
        removeBtn.appendChild(removeBtnNode);
        buttonsDiv.appendChild(removeBtn);

        // Creates the complete button to mark task as completed. Button will be appended as a child to the buttonDiv element.
        const completeBtn = document.createElement("button");
        const completeBtnNode = document.createTextNode("√");
        completeBtn.classList.add("btn", "btn-success");
        completeBtn.setAttribute("id", "completeBtn");
        completeBtn.appendChild(completeBtnNode);
        buttonsDiv.appendChild(completeBtn);

        // Appends the buttonDiv element to the li element.
        item.appendChild(buttonsDiv);

        // Insert the li element into the DOM ul element with id of #todolistUl.
        todoListUl.insertBefore(item,todoListUl.childNodes[0]);

        // Adds an click event listener to the priority button.
        priorityBtn.addEventListener("click", checkPriorityLevel);

        // Adds an click event listener to the remove button.
        removeBtn.addEventListener("click", deleteItem);

        // Adds an click event listener to the complete button.
        completeBtn.addEventListener("click", completedItem);

        // Checks if input value and if true, invokes prepToStoreTodoList function.
        if(input.value !== ""){
            prepToStoreTodoList(todoListUl);
        }

        // This if statement only executes when the IIFE (getStorageItems) runs and return the task(s) stored in the localStorage
        if(dataAttr == "priority"){
            item.setAttribute("data-level","priority");
            item.classList.add("priority-item");
            showPriorityViewToggleBtn();
        }

        if(classAttr == "complete"){
            completeListUl.appendChild(item);
            hidePriorityToggleBtn(todoListUl);
            priorityBtn.style.display = "none";
        }

        // Clears the input field after task is added to the list
        input.value = "";
    };

    // Object constructor template that converts each task in the list(s) in an object.
    // This function will be invoked in the loopListAndStore function to store the list.
    function CreateTasksObj(pTag, span, priorityLevel, classAttr){
        this.pTag = pTag;
        this.spanTag = span;
        this.taskUrgency = priorityLevel;
        this.completeClass = classAttr;
    }

    // This function gets the child elements of the todolistUL and calls the loopTasksLists function
    // whenever one of them is >= 0.
    let prepToStoreTodoList = (todoListUl) => {
        let todoList_Items = document.querySelectorAll("#todolistUl li");

        if(todoList_Items.length >= 0){
            loopTodoListAndSave(todoListUl, todoList_Items);
        }
    };

    // This function loops the lists and creates an object of each child element(task), stringify them and store
    // them in the browsers localStorage object using the Web Storage API.
    let loopTodoListAndSave = (list_Ul, list_Items) => {
        let todoArr = [], paragraph, span, priorityLevel;

        for(let i = 0; i < list_Items.length; i++) {
            paragraph = list_Items[i].childNodes[0].textContent;
            span = list_Items[i].childNodes[1].textContent;
            priorityLevel = list_Ul.children[i].getAttribute("data-level");
            let taskObj = new CreateTasksObj(paragraph, span, priorityLevel);
            todoArr.push(taskObj);
        }
        localStorage.setItem("todo",JSON.stringify(todoArr));
    };

    let prepToStoreCompletedList = (completedListUl) => {
        let completedList_Items = document.querySelectorAll("#completedListUl li");

        if(completedList_Items.length >= 0){
            loopCompletedListAndSave(completedListUl, completedList_Items);
        }
    };

    let loopCompletedListAndSave = (list_Ul, list_Items) => {
        let completeArr = [], paragraph, span, priorityLevel, completeClass;

        for(let i = 0; i < list_Items.length; i++) {
            paragraph     = list_Items[i].childNodes[0].textContent;
            span = list_Items[i].childNodes[1].textContent;
            priorityLevel = list_Ul.children[i].getAttribute("data-level");
            completeClass = "complete";

            let taskObj = new CreateTasksObj(paragraph, span, priorityLevel, completeClass);
            completeArr.push(taskObj);
        }

        localStorage.setItem("complete",JSON.stringify(completeArr));
    };

    // This IIFE will check if there is any tasks stored in the LocalStorage object.
    // If true, it will parse the localStorage object, retrieve the values(tasks) and then invoke the addItems
    // function to render the tasks in the document(DOM).
    (function getStorageItems(){

        if(localStorage.length > 0){
            if(JSON.parse(localStorage.getItem("todo")).length > 0) {
                let todoStorage   = JSON.parse(localStorage.getItem("todo"));
                for(let i = 0; i < todoStorage.length; i++) {
                    addItem(todoStorage[i].pTag, todoStorage[i].spanTag, todoStorage[i].taskUrgency);
                }
            }

            if(JSON.parse(localStorage.getItem("complete")).length > 0){
                let completeStorage   = JSON.parse(localStorage.getItem("complete"));
                for(let i = 0; i < completeStorage.length; i++) {
                    addItem(completeStorage[i].pTag, completeStorage[i].spanTag, completeStorage[i].taskUrgency, completeStorage[i].completeClass);
                }
            }
        }
    })();

    // Event listener for searching specific tasks in the todolist and the completedtaskList
    searchFieldInput.addEventListener("keyup",()=>{
        searchTask(todoListUl);
        searchTask(completeListUl);
    });

    // Checks if the textContent of the tasks has characters matching value that the user inserted in the search field.
    // if value matches, it will show only the task(s) matching the search value and hides the rest of the tasks.
    let searchTask = (list) => {
        let value = searchFieldInput.value;
        let pat = new RegExp(value);

        if(list.childElementCount > 0){
            for( let i = 0; i < list.childElementCount; i++) {
                let getContent = list.children[i].firstElementChild.textContent.toLowerCase();
                if(!getContent.match(pat)){
                    list.children[i].style.display ="none";
                }else {
                    list.children[i].style.display ="";
                }
            }
        }
    };

});

