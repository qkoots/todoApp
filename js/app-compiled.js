"use strict";

// create a priority tasks list which will push items in it by clicking on i.e. a Star-icon.
// when user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
// create a function so items in the completed list can be pushed back to the todoListUl (i.e when user accidentally click complete button).
// line-through the completedTasks text (text-decoration prop CSS).
// Add item to task list by pressing enterKey.
// View option to only see the priority items.
// Empty input form after items has been added.
// integrate search method to search for specific items.
// Search should ignore case-sensitivity.
// Integrate Web Storage API to save data in the Storage object(localStorage).
// Task in LocalStorage that has the data-attr = priority, should render as priority task when page is refresh/reload/visited again.
// Task in LocalStorage that has already been completed should be rendered in the completedListUl when page is refresh/reload/visited again.
// The priorityBtn of tasks in completedListUl should not be displayed when page is refresh/reloaded.

//TODO Program should save the specific date a task was created.
//TODO Program should save the specific date a task was completed.
//TODO Replace icons using font awesome icons.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date


$(function () {

    // Saving the DOM elements in a variables
    var addBtn = document.getElementById("addBtn");
    var todoListUl = document.getElementById("todoListUl");
    var completeListUl = document.getElementById("completedListUl");
    var input = document.getElementById("userInput");
    var priorityListToggleBtn = document.getElementById("priorityListBtn");
    var searchFieldInput = document.getElementById("searchInputField");

    // Click event listener that will get the value from the input form,
    // check if it is not empty, call the addItem function passing the input value as an argument.
    addBtn.addEventListener("click", function () {
        var text = input.value;
        text ? addItem(text) : console.log("No user input");
    });

    // Event listener that will get the value from the input form when the enterKey is pressed,
    // check if it is not empty, call the addItem function passing the input value as an argument.
    input.addEventListener("keyup", function (e) {
        if (e.keyCode === 13) {
            var text = input.value;
            text ? addItem(text, getDate()) : console.log("No user input");
        }
    });

    // This function will check if item has the data-level attr when a user triggers the event(priorityBtn).
    // If true, it will be removed and invoke hidePriorityToggleBtn.
    // If false, markAsPriority function will be invoked
    var checkPriorityLevel = function checkPriorityLevel(e) {
        var item = e.target.parentNode.parentNode;
        if (item.getAttribute("data-level") === "priority") {
            item.removeAttribute("data-level");
            item.classList.remove("priority-item");
            hidePriorityToggleBtn(todoListUl);
            prepToSaveTodoListUl(todoListUl);
        } else {
            markAsPriority(item);
        }
    };

    // This function will apply data attr value of priority to the task and moves it to
    // top of the todoListUl. Then applies specific CSS styles for task labeled as priority and invoke showPriorityViewToggleBtn.
    var markAsPriority = function markAsPriority(item) {
        item.setAttribute("data-level", "priority");
        item.classList.add("priority-item");
        var parent = item.parentNode;
        item.parentNode.insertBefore(item, parent.childNodes[0]);
        showPriorityViewToggleBtn();
        prepToSaveTodoListUl(todoListUl);
    };

    // This function will show the priorityListToggleBtn that will only show tasks labeled
    // as priority (if there is 1 or more task with labeled as priority) and adds an event listener to the priorityListToggleBtn.
    var showPriorityViewToggleBtn = function showPriorityViewToggleBtn() {
        for (var i = 0; i < todoListUl.children.length; i++) {
            if (todoListUl.children[i].getAttribute("data-level") === "priority") {
                priorityListToggleBtn.style.display = "inline-block";
            }
        }
        // Add event listener to the priorityListToggleBtn so showPriorityLabeledItems function can be invoked if button is clicked.
        priorityListToggleBtn.addEventListener("click", showPriorityLabeledItems);
    };

    // This function loops the items in todoListUl and hides tasks that are not labeled as priority.
    // ot also hides the completedListUl.
    var showPriorityLabeledItems = function showPriorityLabeledItems() {
        for (var i = 0; i < todoListUl.children.length; i++) {
            if (todoListUl.children[i].getAttribute("data-level") === null) {
                todoListUl.children[i].style.display = "none";
            }
        }
        // Hides the entire completedListUl.
        completeListUl.style.display = "none";

        // Changes the text of the priorityListToggleBtn when in priority view mode.
        priorityListToggleBtn.textContent = "View All";

        // Add event listener to the priorityListToggleBtn so the showAllItems function can be invoked when event is triggered.
        priorityListToggleBtn.addEventListener("click", showAllItems);
    };

    // This function will display all tasks in the todoListUl(Priority + normal tasks).
    var showAllItems = function showAllItems() {
        for (var i = 0; i < todoListUl.children.length; i++) {
            if (todoListUl.children[i].getAttribute("data-level") === null) {
                todoListUl.children[i].style.display = "";
            }
        }
        // Changes the text of the priorityListToggleBtn when all tasks are displayed.
        priorityListToggleBtn.textContent = "Priorities";

        // Remove the event listener from the priorityListToggleBtn
        priorityListToggleBtn.removeEventListener("click", showAllItems);

        // Adds event listener back to the priorityListToggleBtn which completes the Toggle function of the button.
        priorityListToggleBtn.addEventListener("click", showPriorityLabeledItems);

        // Displays the entire completedListUl.
        completeListUl.style.display = "";
    };

    // This function will hide the priorityListToggleBtn (if there is NO task in todoListUl labeled as priority).
    var hidePriorityToggleBtn = function hidePriorityToggleBtn(list) {

        // counter keeping track of how many task in the list have the data-level attribute.
        var count = 0;

        for (var i = 0; i < list.children.length; i++) {
            if (list.children[i].getAttribute("data-level") !== null) {
                count++;
            }
        }

        if (count >= 1) {
            priorityListToggleBtn.style.display = "inline-block";
        } else {
            priorityListToggleBtn.style.display = "none";
        }
    };

    // Function that will delete the task from the todoListUl and/or completedListUl.
    var deleteItem = function deleteItem(e) {
        var item = e.target.parentNode.parentNode;
        var parent = item.parentNode;
        parent.removeChild(item);

        hidePriorityToggleBtn(todoListUl);

        prepToSaveTodoListUl(todoListUl);
        prepToStoreCompletedList(completeListUl);
    };

    // Function that will remove task from the todoListUl and moves it to the completedListUl and invoke hidePriorityBtn function.
    var completedItem = function completedItem(e) {
        var item = e.target.parentNode.parentNode;
        var parent = item.parentNode;
        //item.children[1].textContent = `Completed on: ${getDate()}`;

        if (parent.getAttribute("id") !== "completedListUl") {
            completeListUl.insertBefore(parent.removeChild(item), completeListUl.childNodes[0]);
            item.classList.add("complete");
            hidePriorityBtn(e);
            prepToStoreCompletedList(completeListUl);
            prepToSaveTodoListUl(todoListUl);
        } else {
            todoListUl.appendChild(item);
            item.classList.remove("complete");
            item.style.textDecoration = "";
            displayPriorityBtn(e);
            prepToSaveTodoListUl(todoListUl);
            prepToStoreCompletedList(completeListUl);
        }

        hidePriorityToggleBtn(todoListUl);
    };

    // Function will display the priority button when task is moved back from "completedListUl" to the todoListUl.
    var displayPriorityBtn = function displayPriorityBtn(e) {
        var item = e.target.parentNode;
        var parent = item.parentNode;
        var priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "inline-block";
    };

    // Function will hide the priority button when task is moved to the completedlistUl.
    var hidePriorityBtn = function hidePriorityBtn(e) {
        var item = e.target.parentNode;
        var parent = item.parentNode;
        var priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "none";
    };

    //Function that gets the current date.
    var getDate = function getDate() {
        var date = new Date();
        var getDate = date.toDateString();
        return getDate;
    };

    // Function that will add task to the todoListUl. The parameter passed to the function is received from the addBtn event listener
    // or from the getStorageItem IIFE.
    var addItem = function addItem(text, date, dataAttr, classAttr) {

        // Creates an li element and set the id attribute
        var item = document.createElement("li");
        item.setAttribute("class", "item");

        // Creates a pElement, appends the text (value) to the pElement and then appends the pElement to the li element.
        var textEl = document.createElement("p");
        var textNode = document.createTextNode(text);
        textEl.appendChild(textNode);
        item.appendChild(textEl);

        // Creates the Date indicator and appends it to the li element.
        var dateSpan = document.createElement("span");
        var dateNode = document.createTextNode("Completed on: " + date);
        dateSpan.appendChild(dateNode);
        dateSpan.className = "dateSpan";
        item.appendChild(dateSpan);

        // Creates a Div element for the remove and complete buttons for every task in the todoListUl.
        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttonsDiv";

        // Creates the priority button so tasks can be labeled as priority. Button will be appended as a child to the buttonDiv element.
        var priorityBtn = document.createElement("button");
        var priorityBtnNode = document.createTextNode("*");
        priorityBtn.classList.add("btn", "btn-info");
        priorityBtn.setAttribute("id", "priorityBtn");
        priorityBtn.appendChild(priorityBtnNode);
        buttonsDiv.appendChild(priorityBtn);

        // Creates the remove button to remove tasks from the todoListUl. Button will be appended as a child to the buttonDiv element.
        var removeBtn = document.createElement("button");
        var removeBtnNode = document.createTextNode("X");
        removeBtn.classList.add("btn", "btn-danger");
        removeBtn.setAttribute("id", "removeBtn");
        removeBtn.appendChild(removeBtnNode);
        buttonsDiv.appendChild(removeBtn);

        // Creates the complete button to mark task as completed. Button will be appended as a child to the buttonDiv element.
        var completeBtn = document.createElement("button");
        var completeBtnNode = document.createTextNode("√");
        completeBtn.classList.add("btn", "btn-success");
        completeBtn.setAttribute("id", "completeBtn");
        completeBtn.appendChild(completeBtnNode);
        buttonsDiv.appendChild(completeBtn);

        // Appends the buttonDiv element to the li element.
        item.appendChild(buttonsDiv);

        // Insert the li element into the DOM ul element with id of #todoListUl.
        todoListUl.insertBefore(item, todoListUl.childNodes[0]);

        // Adds an click event listener to the priority button.
        priorityBtn.addEventListener("click", checkPriorityLevel);

        // Adds an click event listener to the remove button.
        removeBtn.addEventListener("click", deleteItem);

        // Adds an click event listener to the complete button.
        completeBtn.addEventListener("click", completedItem);

        // Checks if input value and if true, invokes prepToSaveTodoListUl function.
        if (input.value !== "") {
            prepToSaveTodoListUl(todoListUl);
        }

        // This if statement only executes when the IIFE (getStorageItems) runs and return the task(s) stored in the localStorage
        if (dataAttr === "priority") {
            item.setAttribute("data-level", "priority");
            item.classList.add("priority-item");
            showPriorityViewToggleBtn();
        }

        if (classAttr === "complete") {
            completeListUl.appendChild(item);
            hidePriorityToggleBtn(todoListUl);
            priorityBtn.style.display = "none";
        }

        // Clears the input field after task is added to the list
        input.value = "";
    };

    // Object constructor template that converts each task in the list(s) in an object.
    // This function will be invoked in the loopListAndStore function to store the list.
    function CreateTasksObj(pTag, date, priorityLevel, classAttr) {
        this.pTag = pTag;
        this.taskDate = date;
        this.taskUrgency = priorityLevel;
        this.completeClass = classAttr;
    }

    // This function gets the child elements of the todolistUL and calls the loopTasksLists function
    // whenever one of them is >= 0.
    var prepToSaveTodoListUl = function prepToSaveTodoListUl(todoListUl) {
        var todoList_Items = document.querySelectorAll("#todoListUl li");

        if (todoList_Items.length >= 0) {
            loopTodoListAndSave(todoListUl, todoList_Items);
        }
    };

    // This function loops the lists and creates an object of each child element(task), stringify them and store
    // them in the browsers localStorage object using the Web Storage API.
    var loopTodoListAndSave = function loopTodoListAndSave(list_Ul, list_Items) {
        var todoArr = [],
            paragraph = void 0,
            dateCreated = void 0,
            priorityLevel = void 0;

        for (var i = 0; i < list_Items.length; i++) {
            paragraph = list_Items[i].childNodes[0].textContent;
            dateCreated = getDate();
            priorityLevel = list_Ul.children[i].getAttribute("data-level");
            var taskObj = new CreateTasksObj(paragraph, dateCreated, priorityLevel);
            todoArr.push(taskObj);
        }
        localStorage.setItem("todo", JSON.stringify(todoArr));
    };

    var prepToStoreCompletedList = function prepToStoreCompletedList(completedListUl) {
        var completedList_Items = document.querySelectorAll("#completedListUl li");

        if (completedList_Items.length >= 0) {
            loopCompletedListAndSave(completedListUl, completedList_Items);
        }
    };

    var loopCompletedListAndSave = function loopCompletedListAndSave(list_Ul, list_Items) {
        var completeArr = [],
            paragraph = void 0,
            dateCompleted = void 0,
            priorityLevel = void 0,
            completeClass = void 0;

        for (var i = 0; i < list_Items.length; i++) {
            paragraph = list_Items[i].childNodes[0].textContent;
            dateCompleted = getDate();
            priorityLevel = list_Ul.children[i].getAttribute("data-level");
            completeClass = "complete";

            var taskObj = new CreateTasksObj(paragraph, dateCompleted, priorityLevel, completeClass);
            completeArr.push(taskObj);
        }

        localStorage.setItem("complete", JSON.stringify(completeArr));
        console.log(localStorage);
    };

    // This IIFE will check if there is any tasks stored in the LocalStorage object.
    // If true, it will parse the localStorage object, retrieve the values(tasks) and then invoke the addItems
    // function to render the tasks in the document(DOM).
    (function getStorageItems() {

        if (localStorage.length > 0) {
            if (JSON.parse(localStorage.getItem("todo")).length > 0) {
                var todoStorage = JSON.parse(localStorage.getItem("todo"));
                for (var i = 0; i < todoStorage.length; i++) {
                    addItem(todoStorage[i].pTag, todoStorage[i].taskDate, todoStorage[i].taskUrgency);
                }
            }

            if (JSON.parse(localStorage.getItem("complete")).length > 0) {
                var completeStorage = JSON.parse(localStorage.getItem("complete"));
                for (var _i = 0; _i < completeStorage.length; _i++) {
                    addItem(completeStorage[_i].pTag, completeStorage[_i].taskDate, completeStorage[_i].taskUrgency, completeStorage[_i].completeClass);
                }
            }
        }
    })();

    // Event listener for searching specific tasks in the todoListUl and the completedListUl
    searchFieldInput.addEventListener("keyup", function () {
        searchTask(todoListUl);
        searchTask(completeListUl);
    });

    // Checks if the textContent of the tasks has characters matching value that the user inserted in the search field.
    // if value matches, it will show only the task(s) matching the search value and hides the rest of the tasks.
    var searchTask = function searchTask(list) {
        var value = searchFieldInput.value;
        var pat = new RegExp(value);

        if (list.childElementCount > 0) {
            for (var i = 0; i < list.childElementCount; i++) {
                var getContent = list.children[i].firstElementChild.textContent.toLowerCase();
                if (!getContent.match(pat)) {
                    list.children[i].style.display = "none";
                } else {
                    list.children[i].style.display = "";
                }
            }
        }
    };
});

//# sourceMappingURL=app-compiled.js.map