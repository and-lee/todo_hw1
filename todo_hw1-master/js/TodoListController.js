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
        let listBeingEdited = window.todo.model.listToEdit;
        window.todo.view.showDialog();
        
        let yes = document.getElementById(TodoGUIId.MODAL_YES_BUTTON);
        let no = document.getElementById(TodoGUIId.MODAL_NO_BUTTON);
        yes.onclick = function() { //yes = delete list
            window.todo.controller.processConfirmDeleteList(listBeingEdited);
        }
        no.onclick = function() { //No = close modal
            window.todo.controller.processCancelDeleteList();
        }

    }

    /**
     * Comfirm in deleting the list removes the list and 
     * returns to the home screen
     */
    processConfirmDeleteList(listBeingEdited) {
        window.todo.view.hideDialog();
        window.todo.model.removeList(listBeingEdited);
        window.todo.model.goHome();
    }

    /**
     * Cancel deleting the list closes the window
     */
    processCancelDeleteList() {
        window.todo.view.hideDialog();
    }

    /**
     * Move current item up the list
     */
    processMoveItemUp(itemArgs){
        let listBeingEdited = window.todo.model.listToEdit;
        
        let temp = listBeingEdited.getItemAtIndex(itemArgs);
        listBeingEdited.items[itemArgs] = listBeingEdited.items[parseInt(itemArgs)-1];
        listBeingEdited.items[parseInt(itemArgs)-1] = temp;

        window.todo.view.loadListData(listBeingEdited); // reload list with changes

    }

    /**
     * Move current item down the list
     */
    processMoveItemDown(itemArgs){
        let listBeingEdited = window.todo.model.listToEdit;

        let temp = listBeingEdited.getItemAtIndex(itemArgs);
        listBeingEdited.items[itemArgs] = listBeingEdited.items[parseInt(itemArgs)+1];
        listBeingEdited.items[parseInt(itemArgs)+1] = temp;

        window.todo.view.loadListData(listBeingEdited); // reload list with changes

    }

    /**
     * Deletes item when button is pressed
     */
    processDeleteItem(itemArgs){
        let listBeingEdited = window.todo.model.listToEdit;
        listBeingEdited.removeItem(listBeingEdited.getItemAtIndex(itemArgs));
        window.todo.view.loadListData(listBeingEdited); // reload list without item
    }

    /**
     * 
     */
    processAddItem() {
        //change edit window
        // CHANGE THE SCREEN
        window.todo.model.goItem();

        //ADD TO LIST
        //let listBeingEdited = window.todo.model.listToEdit;
        //TAG
    }


    /**
     * 
     */
    processEditItem() { //*****************************************************************************
        //change to edit window
        // CHANGE THE SCREEN
        //let listBeingEdited = window.todo.model.listToEdit;
        window.todo.model.goItem();

        // EDIT ITEM
        //TAG
    }

    /**
     * 
     */
    processItemSubmit() {
        //DATA VALUES
        let descriptionTextField = document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD);
        let newDescription = descriptionTextField.value;

        let assignedToTextField = document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD);
        let newAssignedTo = assignedToTextField.value;

        /** IF TEXT FEILDS ARE EMPTY */

        // Due date year-month-day
        let dueDatePicker = document.getElementById(TodoGUIId.ITEM_DUE_DATE_PICKER);
        let dueDatePick = new Date(dueDatePicker.value); // get date value
        
        //let day = ("0" + dueDatePick.getDate()).slice(-2); // -1
        let day = ("0" + (dueDatePick.getDate() + 1)).slice(-2);
        let month = ("0" + (dueDatePick.getMonth() + 1)).slice(-2);
        let dueDate = dueDatePick.getFullYear()+"-"+(month)+"-"+(day);

        if (dueDatePick == "Invalid Date") { //HIDE CREATE BUTTON
            //disable Submit button
            
        }
        


        // Completed
        let completedCheckbox = document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX);
        let completed = completedCheckbox.checked; // returns true/false


        console.log(dueDate);
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