"use strict";

// create a priority tasks list which will push items in it by clicking on i.e. a Star-icon.
// when user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
// create a function so items in the completed list can be pushed back to the tasksList (i.e when user accidentally click complete button).
// line-through the completedTasks text (text-decoration prop CSS).
// Add item to task list by pressing enterKey.
// View option to only see the priority items.
// Empty input form after items has been added.
// Display date when task was send to completed list.
// integrate search method to search for specific items.
// Search should ignore case-sensitivity.
// Integrate Web Storage API to save data in the Storage object(localStorage).
//Task in LocalStorage that has the data-attr = priority, should render as priority task when page is refresh/reload/visited again.

//TODO Task in LocalStorage that has already been completed should be rendered in the completedTasksList when page is refresh/reload/visited again.
//TODO button the Clear all tasks. The user should confirm this action before the program runs the function.
//TODO Replace icons using font awesome icons.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date


$(function () {

    // Saving the DOM elements in a variables
    var addBtn = document.getElementById("addBtn");
    var todoListUl = document.getElementById("todolistUl");
    var completeListUl = document.getElementById("completedListUl");
    var input = document.getElementById("userInput");
    var priorityListBtn = document.getElementById("priorityListBtn");
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
    // If true, it will be removed and invoke hidePriorityViewToggleBtn.
    // If false, priorityItem function will be invoked
    var checkPriorityLevel = function checkPriorityLevel(e) {
        var item = e.target.parentNode.parentNode;
        if (item.getAttribute("data-level")) {
            item.removeAttribute("data-level");
            item.classList.remove("priority-item");
            hidePriorityViewToggleBtn(todoListUl);
            prepToStore(todoListUl, completeListUl);
        } else {
            priorityItem(item);
        }
    };

    // This function will apply data attr value of priority to the task and moves it
    // top off the todolist. Then applies specific CSS styles for task labeled as priority and invoke showPriorityViewToggleBtn.
    var priorityItem = function priorityItem(item) {
        item.setAttribute("data-level", "priority");
        item.classList.add("priority-item");
        var parent = item.parentNode;
        item.parentNode.insertBefore(item, parent.childNodes[0]);
        showPriorityViewToggleBtn();
        prepToStore(todoListUl, completeListUl);
    };

    // This function will show the priority button that will change view to only show tasks labeled
    // as priority (if there is 1 or more task with labeled as priority).
    var showPriorityViewToggleBtn = function showPriorityViewToggleBtn() {
        for (var i = 0; i < todoListUl.children.length; i++) {
            if (todoListUl.children[i].getAttribute("data-level") === "priority") {
                priorityListBtn.style.display = "inline-block";
            }
        }
        // Add event listener to the priorityListBtn so showPriorityLabeledItems function can be invoked if button is clicked.
        priorityListBtn.addEventListener("click", showPriorityLabeledItems);
    };

    // This function shows only the task in the todoList that has been labeled as priority(hiding non-priority tasks).
    var showPriorityLabeledItems = function showPriorityLabeledItems() {
        for (var i = 0; i < todoListUl.children.length; i++) {
            if (todoListUl.children[i].getAttribute("data-level") === null) {
                todoListUl.children[i].style.display = "none";
            }
        }

        // Changes the text of the button when in priority view.
        priorityListBtn.textContent = "View All";

        // Add event listener to the priorityListBtn so showAlltems function can be invoked if button is clicked.
        priorityListBtn.addEventListener("click", showAllItems);
    };

    // This function will display all task in the todolist if the recent view was to only show tasks labeled as priority.
    var showAllItems = function showAllItems() {
        for (var i = 0; i < todoListUl.children.length; i++) {
            if (todoListUl.children[i].getAttribute("data-level") === null) {
                todoListUl.children[i].style.display = "";
            }
        }
        // Changes the text of the button when all tasks are displayed.
        priorityListBtn.textContent = "Priorities";

        // Remove the event listener from the button
        priorityListBtn.removeEventListener("click", showAllItems);

        // Adds event listener back to the PriorityList button which completes the Toggle function of the button.
        priorityListBtn.addEventListener("click", showPriorityLabeledItems);
    };

    // This function will hide the priority button that will show only tasks labeled as priority. (if there is NO task with priority label).
    var hidePriorityViewToggleBtn = function hidePriorityViewToggleBtn(list) {

        // counter keeping track of how many task in the list have the data-level attribute.
        var count = 0;

        for (var i = 0; i < list.children.length; i++) {
            if (list.children[i].getAttribute("data-level") !== null) {
                count++;
                priorityListBtn.style.display = "inline-block";
            } else {
                if (count > 0) {
                    priorityListBtn.style.display = "inline-block";
                } else {
                    priorityListBtn.style.display = "none";
                }
            }
        }
    };

    // Function that will delete the task from the todolist/completedList and invoke function checkForPriorityLabeledTask
    var deleteItem = function deleteItem(e) {
        var item = e.target.parentNode.parentNode;
        var parent = item.parentNode;
        parent.removeChild(item);
        checkForPriorityLabeledTask();
        prepToStore(todoListUl, completeListUl);
    };

    // Function that will invoked the hidePriorityViewToggleBtn function if the todolist > 0 ;
    var checkForPriorityLabeledTask = function checkForPriorityLabeledTask() {
        if (todoListUl.childElementCount > 0) {
            hidePriorityViewToggleBtn(todoListUl);
        } else if (completeListUl.childElementCount > 0) {
            hidePriorityViewToggleBtn(completeListUl);
        }
    };

    // Function that will remove task from the todolist and moves it to the completedtaskList and invoke hidePriorityBtn function.
    var completedItem = function completedItem(e) {
        var item = e.target.parentNode.parentNode;
        var parent = item.parentNode;
        item.children[1].textContent = "Completed on: " + getDate();
        item.classList.add("complete");

        if (parent.getAttribute("id") !== "completedListUl") {
            completeListUl.insertBefore(parent.removeChild(item), completeListUl.childNodes[0]);
            hidePriorityBtn(e);
        } else {
            todoListUl.appendChild(item);
            item.style.textDecoration = "";
            displayPriorityBtn(e);
            item.classList.remove("complete");
        }
    };

    // Function will display the priority button when task is moved back from "completedtaskList" to the todolist.
    var displayPriorityBtn = function displayPriorityBtn(e) {
        var item = e.target.parentNode;
        var parent = item.parentNode;
        var priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "inline-block";
    };

    // Function will hide the priority button when task is moved to the completedtasklist.
    var hidePriorityBtn = function hidePriorityBtn(e) {
        var item = e.target.parentNode;
        var parent = item.parentNode;
        var priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "none";
    };

    // Function that gets the current date.
    var getDate = function getDate() {
        var date = new Date();
        var getDate = date.toDateString();
        return getDate;
    };

    // Function that will add task to the todolist. The parameter passed to the function is received from the addBtn eventlistener
    // or from the getStorageItem IIFE.
    var addItem = function addItem(text, spanTag, dataAttr) {

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
        var dateNode = document.createTextNode("Created on: " + getDate() || spanTag);
        dateSpan.appendChild(dateNode);
        dateSpan.className = "dateSpan";
        item.appendChild(dateSpan);

        // Creates a Div element for the remove and complete buttons for every task in the todolist.
        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttonsDiv";

        // Creates the priority button so tasks can be labeled as priority. Button will be appended as a child to the buttonDiv element.
        var priorityBtn = document.createElement("button");
        var priorityBtnNode = document.createTextNode("*");
        priorityBtn.classList.add("btn", "btn-info");
        priorityBtn.setAttribute("id", "priorityBtn");
        priorityBtn.appendChild(priorityBtnNode);
        buttonsDiv.appendChild(priorityBtn);

        // Creates the remove button to remove tasks from the todolist. Button will be appended as a child to the buttonDiv element.
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

        // Insert the li element into the DOM ul element with id of #todolistUl.
        todoListUl.insertBefore(item, todoListUl.childNodes[0]);

        // Adds an click event listener to the priority button.
        priorityBtn.addEventListener("click", checkPriorityLevel);

        // Adds an click event listener to the remove button.
        removeBtn.addEventListener("click", deleteItem);

        // Adds an click event listener to the complete button.
        completeBtn.addEventListener("click", completedItem);

        // Checks if input value and if true, invokes prepToStore function.
        if (input.value !== "") {
            prepToStore(todoListUl, completeListUl);
        }

        // This if statement only executes when the IIFE (getStorageItems) runs and return the task(s) stored in the localStorage
        if (dataAttr == "priority") {
            item.setAttribute("data-level", "priority");
            item.classList.add("priority-item");
            showPriorityViewToggleBtn();
        }

        // Clears the input field after task is added to the list
        input.value = "";
    };

    // Object constructor template that converts each task in the list(s) in an object.
    // This function will be invoked in the loopTaskListsAndStore function to store the list.
    function CreateTasksObj(pTag, span, priorityLevel) {
        this.pTag = pTag;
        this.spanTag = span;
        this.priority = priorityLevel;
    }

    // This function gets the child elements of both the todolistUL and the completedlistUl and calls the loopTasksLists function
    // whenever one ot them is >= 0.
    var prepToStore = function prepToStore(tasksList, completedTasksList) {
        var listItems = document.querySelectorAll("#todolistUl li");
        var completedlistItems = document.querySelectorAll("#completedListUl li");

        if (tasksList.childElementCount >= 0) {
            loopTaskListsAndStore(listItems, tasksList);
        } else if (completedTasksList.childElementCount >= 0) {
            loopTaskListsAndStore(completedlistItems, completedTasksList);
        }
    };

    // This function loops the todolist and creates an object of each child element(task), stringify them and store
    // them in the browsers localStorage object using the Web Storage API.
    var loopTaskListsAndStore = function loopTaskListsAndStore(listItems, taskList) {
        var taskArr = [];
        var paragraph = void 0,
            span = void 0,
            priorityLevel = void 0;

        for (var i = 0; i < listItems.length; i++) {
            paragraph = listItems[i].childNodes[0].textContent;
            span = listItems[i].childNodes[1].textContent;
            priorityLevel = taskList.children[i].getAttribute("data-level");
            var taskObj = new CreateTasksObj(paragraph, span, priorityLevel);
            taskArr.push(taskObj);
        }
        localStorage.setItem("tasks", JSON.stringify(taskArr));
        console.log(localStorage);
    };

    // This IIFE will check if there is any tasks stored in the LocalStorage object.
    // If true, it will parse the localStorage object, retrieve the values(tasks) and then invoke the addItems
    // function to render the tasks in the document(DOM).
    (function getStorageItems() {
        console.log(localStorage);

        if (localStorage.length > 0) {
            var storage = JSON.parse(localStorage.getItem("tasks"));
            var storageLength = storage.length;

            for (var i = 0; i < storageLength; i++) {
                addItem(storage[i].pTag, storage[i].spanTag, storage[i].priority, storage[i].class);
            }
        }
    })();

    // Event listener for searching specific tasks in the todolist and the completedtaskList
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