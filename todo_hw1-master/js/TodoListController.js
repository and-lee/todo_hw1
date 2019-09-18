'use strict'
/**
 * TodoListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
class TodoListController {
    /**
     * The constructor sets up all event handlers for all user interface
     * controls known at load time, meaning the controls that are declared 
     * inside index.html.
     */
    constructor() {
        // SETUP ALL THE EVENT HANDLERS FOR EXISTING CONTROLS,
        // MEANING THE ONES THAT ARE DECLARED IN index.html

        // FIRST THE NEW LIST BUTTON ON THE HOME SCREEN
        this.registerEventHandler(TodoGUIId.HOME_NEW_LIST_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CREATE_NEW_LIST]);

        // THEN THE CONTROLS ON THE LIST SCREEN
        this.registerEventHandler(TodoGUIId.LIST_HEADING, TodoHTML.CLICK, this[TodoCallback.PROCESS_GO_HOME]);
        this.registerEventHandler(TodoGUIId.LIST_TRASH, TodoHTML.CLICK, this[TodoCallback.PROCESS_DELETE_LIST]);
        this.registerEventHandler(TodoGUIId.LIST_NAME_TEXTFIELD, TodoHTML.KEYUP, this[TodoCallback.PROCESS_CHANGE_NAME]);
        this.registerEventHandler(TodoGUIId.LIST_OWNER_TEXTFIELD, TodoHTML.KEYUP, this[TodoCallback.PROCESS_CHANGE_OWNER]);

        // CONTROLS ON EDIT SCREEN
        this.registerEventHandler(TodoGUIId.ITEM_FROM_SUBMIT_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_ITEM_SUBMIT]); //
        this.registerEventHandler(TodoGUIId.ITEM_FROM_CANCEL_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_ITEM_CANCEL]); //

        // CONTROLS ON THE MODAL
        this.registerEventHandler(TodoGUIId.MODAL_YES_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CONFIRM_DELETE_LIST]);
        this.registerEventHandler(TodoGUIId.MODAL_NO_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CANCEL_DELETE_LIST]);
    }
    

    /**
     * This function helps the constructor setup the event handlers for all controls.
     * 
     * @param {TodoGUIId} id Unique identifier for the HTML control on which to
     * listen for events.
     * @param {TodoHTML} eventName The type of control for which to respond.
     * @param {TodoCallback} callback The callback function to be executed when
     * the event occurs.
     */
    registerEventHandler(id, eventName, callback) {
        // GET THE CONTROL IN THE GUI WITH THE CORRESPONDING id
        let control = document.getElementById(id);

        // AND SETUP THE CALLBACK FOR THE SPECIFIED EVENT TYPE
        control.addEventListener(eventName, callback);
    }

    /**
     * This function responds to when the user changes the
     * name of the list via the textfield.
     */
    processChangeName() {
        let nameTextField = document.getElementById(TodoGUIId.LIST_NAME_TEXTFIELD);
        let newName = nameTextField.value;
        let listBeingEdited = window.todo.model.listToEdit;
        window.todo.model.updateListName(listBeingEdited, newName);
    }

    /**
     * This function responds to when the user changes the
     * Owner of the list via the textfield.
     */
    processChangeOwner() {
        let ownerTextField = document.getElementById(TodoGUIId.LIST_OWNER_TEXTFIELD);
        let newOwner = ownerTextField.value;
        let listBeingEdited = window.todo.model.listToEdit;
        window.todo.model.updateListOwner(listBeingEdited, newOwner);
    }

    /**
     * This function is called when the user requests to create
     * a new list.
     */
    processCreateNewList() {
        // MAKE A BRAND NEW LIST
        window.todo.model.loadNewList();

        // CHANGE THE SCREEN
        window.todo.model.goList();
    }

    /**
     * This function responds to when the user clicks on a link
     * for a list on the home screen.
     * 
     * @param {String} listName The name of the list to load into
     * the controls on the list screen.
     */
    processEditList(listName) {
        // LOAD THE SELECTED LIST
        window.todo.model.loadList(listName);

        // CHANGE THE SCREEN
        window.todo.model.goList();
    }

    /**
     * This function responds to when the user clicks on the
     * todo logo to go back to the home screen.
     */
    processGoHome() {
        window.todo.model.goHome();
    }

    /**
     * This function responds to when the user clicks on the
     * trash icon to delete the current list. Conformation appears
     */
    processDeleteList() {
        window.todo.view.showDialog();
        document.body.classList.add(TodoGUIId.MODAL_OPEN);
    }

    /**
     * Comfirm in deleting the list removes the list and 
     * returns to the home screen
     */
    processConfirmDeleteList() {
        let listBeingEdited = window.todo.model.listToEdit;
        //window.todo.view.hideDialog();
        //document.body.classList.remove(TodoGUIId.MODAL_OPEN);
        window.todo.controller.processCancelDeleteList();
        window.todo.model.removeList(listBeingEdited);
        window.todo.model.goHome();
    }

    /**
     * Cancel deleting the list closes the window
     */
    processCancelDeleteList() {
        window.todo.view.hideDialog();
        document.body.classList.remove(TodoGUIId.MODAL_OPEN);
    }

    /**
     * Move current item up the list
     */
    processMoveItemUp(itemArgs){
        if (parseInt(itemArgs) != 0) { // not disabeled
            let listBeingEdited = window.todo.model.listToEdit;

            let temp = listBeingEdited.getItemAtIndex(itemArgs);
            listBeingEdited.items[itemArgs] = listBeingEdited.items[parseInt(itemArgs)-1];
            listBeingEdited.items[parseInt(itemArgs)-1] = temp;

            window.todo.view.loadListData(listBeingEdited); // reload list with changes
        }
        
        event.stopPropagation(); // on edit item card
    }

    /**
     * Move current item down the list
     */
    processMoveItemDown(itemArgs){
        if (parseInt(itemArgs) != window.todo.model.listToEdit.items.length-1) {
            let listBeingEdited = window.todo.model.listToEdit;

            let temp = listBeingEdited.getItemAtIndex(itemArgs);
            listBeingEdited.items[itemArgs] = listBeingEdited.items[parseInt(itemArgs)+1];
            listBeingEdited.items[parseInt(itemArgs)+1] = temp;
    
            window.todo.view.loadListData(listBeingEdited); // reload list with changes
        }
        
        event.stopPropagation(); // on edit item card
    }

    /**
     * Deletes item when button is pressed
     */
    processDeleteItem(itemArgs) {
        let listBeingEdited = window.todo.model.listToEdit;
        listBeingEdited.removeItem(listBeingEdited.getItemAtIndex(itemArgs));
        window.todo.view.loadListData(listBeingEdited); // reload list without item
        event.stopPropagation(); // on edit item card
    }

    /**
     * Adds tag to know to add item
     * Goes to edit item screen
     */
    processAddItem() {
        // change edit window
        window.todo.model.goItem();

        // ADD TO LIST
        // TAG
        window.todo.model.setIsEditingItem(false);
        
        document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD).value="Unknown";
        document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD).value="Unknown";
        document.getElementById(TodoGUIId.ITEM_DUE_DATE_PICKER).value="";
        document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX).checked=false;
    }


    /**
     * Adds tag to know to edit item
     * Goes to edit item screen
     */
    processEditItem(itemArgs) {
        // change to edit window
        window.todo.model.goItem();

        // TAG EDIT ITEM
        window.todo.model.setIsEditingItem(true);
        this.itemIndex = itemArgs; // index of item

        // load item data on edit item screen
        let editItem = window.todo.model.listToEdit.getItemAtIndex(itemArgs);
        document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD).value = editItem.getDescription();
        document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD).value = editItem.getAssignedTo();
        document.getElementById(TodoGUIId.ITEM_DUE_DATE_PICKER).value = editItem.getDueDate();
        document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX).checked = editItem.isCompleted();
    }

    /**
     * Adds or edits item when submit button is pressed on edit item screen
     */
    processItemSubmit() {
        //DATA VALUES
        let descriptionTextField = document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD);
        let newDescription = descriptionTextField.value;

        let assignedToTextField = document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD);
        let newAssignedTo = assignedToTextField.value;

        // Due date year-month-day
        let dueDatePicker = document.getElementById(TodoGUIId.ITEM_DUE_DATE_PICKER);
        let dueDate = dueDatePicker.value; // get date value
        
        // Completed
        let completedCheckbox = document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX);
        let completed = completedCheckbox.checked; // returns true/false

        let listBeingEdited = window.todo.model.listToEdit;
        if (window.todo.model.isEditingItem()) {
            let editItem = listBeingEdited.getItemAtIndex(window.todo.controller.itemIndex);

            editItem.setDescription(newDescription);
            editItem.setAssignedTo(newAssignedTo);
            editItem.setDueDate(dueDate);
            editItem.setCompleted(completed);
            
        } else { // add item
            let newItem = new TodoListItem();
            newItem.setDescription(newDescription);
            newItem.setAssignedTo(newAssignedTo);
            newItem.setDueDate(dueDate);
            newItem.setCompleted(completed);

            listBeingEdited.addItem(newItem);
        }

        window.todo.view.loadListData(listBeingEdited); // reload list
        window.todo.controller.processItemCancel(); // reset data feilds and return to updated list

    }

    /**
     * Exits edit item list and returns to the list screen.
     */
    processItemCancel() {
        // reset data feilds
        document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD).value="";
        document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD).value="";
        document.getElementById(TodoGUIId.ITEM_DUE_DATE_PICKER).value="";
        document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX).checked=false;
        
        window.todo.model.goList();
    }

    /**
     * This function is called in response to when the user clicks
     * on the Task header in the items table.
     */
    processSortItemsByTask() {
        // IF WE ARE CURRENTLY INCREASING BY TASK SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_TASK_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCREASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_TASK_INCREASING);
        }
    }

    /**
     * This function is called in response to when the user clicks
     * on the Status header in the items table.
     */
    processSortItemsByStatus() {
        // IF WE ARE CURRENTLY INCREASING BY STATUS SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_STATUS_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCREASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_STATUS_INCREASING);
        }
    }

    /**
     * This functtion is called in response to when the user clicks
     * on the Due Date header in the items table.
     */
    processSortItemsByDueDate() {
        if(window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING);
        } else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING);
        }
    }

}