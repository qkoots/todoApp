"use strict";

// create a priority tasks list which will push items in it by clicking on i.e. a Star-icon.
// when user clicks on priority icons and if item is already marked as priority, the priority class and attributes should be removed.
// create a function so items in the completed list can be pushed back to the tasksList (i.e when user accidentally click complete button).
// line-through the completedTasks text (text-decoration prop CSS).
// Add item to task list by pressing enterKey.
// View option to only see the priority items.
// Empty input form after items has been added.
// Display date when task was send to completed list.
// integrate search method to search for specific items
// Search should ignore case-sensitivity

//TODO button the Clear all tasks. The user should confirm this action before the program runs the function.
//TODO Integrate Web Storage API to save data in the browser.
//TODO Replace icons using font awesome icons.
//TODO Users should be able to sort tasks alphabetically
//TODO Users should be able to sort tasks by date


$(function () {

    // Saving the DOM elements in a variables
    var addBtn = document.getElementById("addBtn");
    var itemList = document.getElementById("listUl");
    var completedItemList = document.getElementById("completedListUl");
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

    // This function will check if item has the data-level attr. If true, it will be removed and invoke hidePriorityViewToggleBtn.
    // If false, priorityItem function will be invoked
    var checkPriorityLevel = function checkPriorityLevel(e) {
        var item = e.target.parentNode.parentNode;
        if (item.getAttribute("data-level")) {
            item.removeAttribute("data-level");
            item.classList.remove("priority-item");
            hidePriorityViewToggleBtn(itemList);
        } else {
            priorityItem(item);
        }
    };

    // This function will apply data attr value of priority to the item and move the item to the
    // top off the list mark it as a priority by applying specific CSS styles and invoke showPriorityViewToggleBtn.
    var priorityItem = function priorityItem(item) {
        item.setAttribute("data-level", "priority");
        item.classList.add("priority-item");
        var parent = item.parentNode;
        item.parentNode.insertBefore(item, parent.childNodes[0]);
        showPriorityViewToggleBtn();
        storeItemInLocalStorage(itemList, completedItemList);
    };

    // This function will show the priority button that will change view to only show task labeled
    // as priority (if there is 1 or more task with priority label).
    var showPriorityViewToggleBtn = function showPriorityViewToggleBtn() {
        for (var i = 0; i < itemList.children.length; i++) {
            if (itemList.children[i].getAttribute("data-level") === "priority") {
                priorityListBtn.style.display = "inline-block";
            }
        }
        // Add event listener to the priorityListBtn so showPriorityLabeledItems function can be invoked if button is clicked.
        priorityListBtn.addEventListener("click", showPriorityLabeledItems);
    };

    // This function shows only the task in the tasksList that has been labeled as priority task (hiding non-priority tasks);
    var showPriorityLabeledItems = function showPriorityLabeledItems() {
        for (var i = 0; i < itemList.children.length; i++) {
            if (itemList.children[i].getAttribute("data-level") === null) {
                itemList.children[i].style.display = "none";
            }
        }

        // Changes the text of the button when in priority view.
        priorityListBtn.textContent = "View All";

        // Add event listener to the priorityListBtn so showAlltems function can be invoked if button is clicked.
        priorityListBtn.addEventListener("click", showAllItems);
    };

    // This function will display all items in the task list if the recent view was to view to only show tasks labeled as priority
    var showAllItems = function showAllItems() {
        for (var i = 0; i < itemList.children.length; i++) {
            if (itemList.children[i].getAttribute("data-level") === null) {
                itemList.children[i].style.display = "";
            }
        }
        // Changes the text of the button when all tasks are displayed.
        priorityListBtn.textContent = "Priorities";

        // Remove the event listener from the button
        priorityListBtn.removeEventListener("click", showAllItems);

        // Adds event listener back to the PriorityList button which completes the Toggle function of the button.
        priorityListBtn.addEventListener("click", showPriorityLabeledItems);
    };

    // This function will hide the priority button that will change view to only show task labeled as priority. (if there is NO task with priority label).
    var hidePriorityViewToggleBtn = function hidePriorityViewToggleBtn(list) {

        // counter keeping track of how many items in the list have the data-level attribute
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

    // Function that will delete the list item form the items list and invoke function checkForPriorityLabeledTask
    var deleteItem = function deleteItem(e) {
        var item = e.target.parentNode.parentNode;
        var parent = item.parentNode;
        parent.removeChild(item);
        checkForPriorityLabeledTask();
        storeItemInLocalStorage(itemList, completedItemList);
    };

    // Function that will invoked the hidePriorityViewToggleBtn function if one of the lists is > 0 (items);
    var checkForPriorityLabeledTask = function checkForPriorityLabeledTask() {
        if (itemList.childElementCount > 0) {
            hidePriorityViewToggleBtn(itemList);
        } else if (completedItemList.childElementCount > 0) {
            hidePriorityViewToggleBtn(completedItemList);
        }
    };

    // Function that will remove item form the items list and put it on the completed tasks list and invoke hidePriorityBtn function.
    var completedItem = function completedItem(e) {
        var item = e.target.parentNode.parentNode;
        var parent = item.parentNode;
        item.children[1].textContent = "Completed on: " + getDate();

        if (parent.getAttribute("id") !== "completedListUl") {
            completedItemList.insertBefore(parent.removeChild(item), completedItemList.childNodes[0]);
            hidePriorityBtn(e);
        } else {
            itemList.appendChild(item);
            item.style.textDecoration = "";
            displayPriorityBtn(e);
        }
    };

    // Function will display the priority button when item is moved back from "completed task list" to the "still to do" task list.
    var displayPriorityBtn = function displayPriorityBtn(e) {
        var item = e.target.parentNode;
        var parent = item.parentNode;
        var priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "inline-block";
    };

    // Function will hide the priority button when item is moved to the completed tasks list.
    var hidePriorityBtn = function hidePriorityBtn(e) {
        var item = e.target.parentNode;
        var parent = item.parentNode;
        var priorityBtn = parent.children[2].children[0];
        priorityBtn.style.display = "none";
    };

    var getDate = function getDate() {
        var date = new Date();
        var getDate = date.toDateString();
        return getDate;
    };

    // Function that will add items to the list. The parameter passed to the function is received from the addBtn event listener.
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

        // Creates a Div element for the remove and complete buttons for every item in the list
        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttonsDiv";

        // Creates the priority button so priority tasks can be moved to top of the list
        var priorityBtn = document.createElement("button");
        var priorityBtnNode = document.createTextNode("*");
        priorityBtn.classList.add("btn", "btn-info");
        priorityBtn.setAttribute("id", "priorityBtn");
        priorityBtn.appendChild(priorityBtnNode);
        buttonsDiv.appendChild(priorityBtn);

        // Creates the remove button to remove items from the list and append it as an child to the buttonDiv element.
        var removeBtn = document.createElement("button");
        var removeBtnNode = document.createTextNode("X");
        removeBtn.classList.add("btn", "btn-danger");
        removeBtn.setAttribute("id", "removeBtn");
        removeBtn.appendChild(removeBtnNode);
        buttonsDiv.appendChild(removeBtn);

        // Creates the complete button to add completed items to the completed tasks list and append it as an child to the buttonDiv element.
        var completeBtn = document.createElement("button");
        var completeBtnNode = document.createTextNode("√");
        completeBtn.classList.add("btn", "btn-success");
        completeBtn.setAttribute("id", "completeBtn");
        completeBtn.appendChild(completeBtnNode);
        buttonsDiv.appendChild(completeBtn);

        // Appends the buttonDiv element to the li element.
        item.appendChild(buttonsDiv);

        // Insert the li element into the DOM ul element with id of #listUl.
        itemList.insertBefore(item, itemList.childNodes[0]);

        if (dataAttr === "priority") {
            priorityItem(item);
        }

        // Adds an click event listener to the priority button to move items marked as priority to the top of the list.
        priorityBtn.addEventListener("click", checkPriorityLevel);

        // Adds an click event listener to the remove button to remove the item from the list.
        removeBtn.addEventListener("click", deleteItem);

        // Adds an click event listener to the remove button to remove the item from the list.
        completeBtn.addEventListener("click", completedItem);

        // Checks if input value and if true, invokes storeItemInLocal.
        if (input.value !== "") {
            storeItemInLocalStorage(itemList, completedItemList);
        }

        // Clears the input field after task is added to the list
        input.value = "";
    };

    // Checks if the textContent of the list item has characters matching value that the user inserted in the search field.
    // if value matches, it will show only those items matching the search value and hides the rest of the items
    searchFieldInput.addEventListener("keyup", function () {
        var value = searchFieldInput.value;
        var pat = new RegExp(value);

        if (itemList.childElementCount > 0) {
            for (var i = 0; i < itemList.childElementCount; i++) {
                var getContent = itemList.children[i].firstElementChild.textContent.toLowerCase();
                if (!getContent.match(pat)) {
                    itemList.children[i].style.display = "none";
                } else {
                    itemList.children[i].style.display = "";
                }
            }
        }

        if (completedItemList.childElementCount > 0) {
            for (var _i = 0; _i < completedItemList.childElementCount; _i++) {
                var _getContent = completedItemList.children[_i].firstElementChild.textContent.toLowerCase();
                if (!_getContent.match(pat)) {
                    completedItemList.children[_i].style.display = "none";
                } else {
                    completedItemList.children[_i].style.display = "";
                }
            }
        }
    });

    // Object constructor template that converts each task in the list in an object.
    // This function will be invoked in the storeItemInLocaleStorage to store the tasks list.
    function CreateTasksObj(pTag, span, priorityLevel) {
        this.pTag = pTag;
        this.spanTag = span;
        this.priority = priorityLevel;
    }

    // Function that will stringify the tasks to store them in the browsers localStorage object using the Web Storage API.
    var storeItemInLocalStorage = function storeItemInLocalStorage(tasksList, completedTasksList) {
        var taskArr = [];

        if (tasksList.childElementCount > 0) {
            var paragraph = void 0,
                span = void 0,
                priorityLevel = void 0;
            var listItems = document.querySelectorAll("#listUl li");

            for (var i = 0; i < listItems.length; i++) {
                paragraph = listItems[i].childNodes[0].textContent;
                span = listItems[i].childNodes[1].textContent;
                priorityLevel = tasksList.children[i].getAttribute("data-level");
                var taskObj = new CreateTasksObj(paragraph, span, priorityLevel);
                taskArr.push(taskObj);
            }
        } else if (completedTasksList.childElementCount > 0) {
            var _paragraph = void 0,
                _span = void 0,
                _priorityLevel = void 0;
            var _listItems = document.querySelectorAll("#completedListUl li");

            for (var _i2 = 0; _i2 < _listItems.length; _i2++) {
                _paragraph = _listItems[_i2].childNodes[0].textContent;
                _span = _listItems[_i2].childNodes[1].textContent;
                _priorityLevel = completedTasksList.children[_i2].getAttribute("data-level");
                var _taskObj = new CreateTasksObj(_paragraph, _span, _priorityLevel);
                taskArr.push(_taskObj);
            }
        }
        localStorage.setItem("tasks", JSON.stringify(taskArr));
        console.log(localStorage);

        return;
    };

    // This IIFE will check if there is any tasks stored in the LocalStorage object.
    // If true, it will parse the localStorage object, retrieve the values(tasks) and then invoke the addItems
    // function to render the tasks in the document(DOM).
    (function getStorageItems() {
        if (localStorage.length > 0) {
            var storage = JSON.parse(localStorage.getItem("tasks"));

            var storageLength = storage.length;
            for (var i = 0; i < storageLength; i++) {
                addItem(storage[i].pTag, storage[i].spanTag, storage[i].priority);
            }
        }
    })();
});

//# sourceMappingURL=app-compiled.js.map