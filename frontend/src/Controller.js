import logger from './util/SimpleDebug.js';
import downloader from "./util/DownloadManager.js";
import stateManager from "./util/StateManagementUtil.js";
import isSameNote, {isSameNoteById} from "./util/EqualityFunctions.js";


export default class Controller {

    constructor(applicationView, clientSideStorage) {
        this.applicationView = applicationView;
        this.clientSideStorage = clientSideStorage;

        // setup event handlers and local storage access call
        this.handleEventSaveCurrentNote = this.handleEventSaveCurrentNote.bind(this);
        this.handleEventDeleteNote = this.handleEventDeleteNote.bind(this);
        this.handleEventAddNewNote = this.handleEventAddNewNote.bind(this);

        // setup Async callbacks for the fetch requests
        this.callbackGetAllNotes = this.callbackGetAllNotes.bind(this);
        this.callbackUpdateNote = this.callbackUpdateNote.bind(this);
        this.callbackDeleteNote = this.callbackDeleteNote.bind(this);

        // state listening
        this.stateChangeListenerForNotes = this.stateChangeListenerForNotes.bind(this);
    }

    initialise() { // load default saved states
        this.config = this.applicationView.state;
        stateManager.addChangeListenerForName(this.config.stateNames.notes,this.stateChangeListenerForNotes);

        document.getElementById(this.config.ui.navigation.addButtonId).addEventListener("click",this.handleEventAddNewNote);
        document.getElementById(this.config.ui.navigation.saveButtonId).addEventListener("click",this.handleEventSaveCurrentNote);

        // get initial state
        this.getAllNotes();
    }

    // update application state when changes occur
    stateChangeListenerForNotes(name,notes) {
        logger.log("State change received",10);
        logger.log(notes);
        if (notes.length > 0) {
            logger.log("State change received > 0",10);
            // has the previously selected note been deleted?
            let selectedNote = this.applicationView.state.selectedNote;
            if (selectedNote) {
                if (stateManager.isItemInState(this.config.stateNames.notes,selectedNote,isSameNote)) {
                    logger.log("State change received - currently selected item still in state",10);
                    // stay on the same selected note
                    this.applicationView.setState({notes:notes,selectedNote:selectedNote});
                }
                else {
                    logger.log("State change received - currently selected item gone from state",10);
                    // go to the first note, the previously selected one is gone
                    this.applicationView.setState({notes:notes,selectedNote:notes[0]});
                }
            }
            else {
                logger.log("State change received - there wasn't a selected note",10);
                // no selected note
                this.applicationView.setState({notes:notes,selectedNote:null});
            }
        }
        else {
            logger.log("State change received - no notes left",10);
            // no notes left to select
            this.applicationView.setState({notes:notes,selectedNote:null});
        }
    }
    handleEventAddNewNote(event) {
        logger.log(`Controller: Adding new note`,10);
        event.preventDefault();

        logger.log(`Controller: Saving new note`,10);
        let jsonRequest = {
            url: this.config.api.update,
            params: {
                type: "POST",
                title:"Title",
                note:"Note"
            },
            callback: this.callbackUpdateNote
        }
        downloader.addApiRequest(jsonRequest,true);

    }

    handleEventSaveCurrentNote(event) {
        if (!document.getElementById(this.config.ui.noteDetails.noteIdElId)) return;
        // get the dom elements
        let noteIdEl = document.getElementById(this.config.ui.noteDetails.noteIdElId);
        let noteTitleEl = document.getElementById(this.config.ui.noteDetails.titleElId);
        let contentEl = document.getElementById(this.config.ui.noteDetails.contentElId);

        let noteId = noteIdEl.value;
        let noteTitle = noteTitleEl.value.trim();
        let noteContent = contentEl.value.trim();
        logger.log(`Controller: Saving note with id ${noteId}`,10);
        let jsonRequest = {
            url: this.config.api.update,
            params: {
                type: "POST",
                title: noteTitle,
                note: noteContent
            },
            callback: this.callbackUpdateNote
        }
        if ((noteId) && (noteId !== "") && (noteId !== -1)) jsonRequest.params["id"] = noteId;
        downloader.addApiRequest(jsonRequest,true);
    }

    handleEventDeleteNote(event) {
        let noteId = event.target.getAttribute(this.config.data.id);
        logger.log(`Controller: Deleting note with id ${noteId}`,10);
        if (noteId) {
            // remove the item from the state manager
            let note = stateManager.findItemInState(this.config.stateNames.notes,noteId,isSameNoteById);
            if (note) {
                let jsonRequest = {
                    url: this.config.api.delete,
                    params: {
                        type: "DELETE",
                        id: noteId
                    },
                    callback: this.callbackDeleteNote
                }
                downloader.addApiRequest(jsonRequest);
                stateManager.removeItemFromState(this.config.stateNames.notes,note,isSameNote);
            }
        }
    }

    getAllNotes() {
        let jsonRequest = {
            url: this.config.api.get,
            params: {
                type: "GET"
            },
            callback: this.callbackGetAllNotes,
        }
        downloader.addApiRequest(jsonRequest,true);
    }

    /* example interface used from the callback for FetchUtil */
    callbackGetAllNotes(jsonData, httpStatus) {
        logger.log(`Controller: Get All Notes callback ${httpStatus}`,10);
        let notes = [];
        if (httpStatus >= 200 && httpStatus <= 299) { // do we have any data?

            logger.log(jsonData, 70);
            notes = jsonData;
        }
        stateManager.setStateByName(this.config.stateNames.notes,notes);
    }

    callbackUpdateNote(jsonData,httpStatus) {
        logger.log("Controller: Update note callback",10);
        let note = {};
        if (httpStatus >= 200 && httpStatus <= 299) { // do we have any data?

            logger.log(jsonData, 70);
            note = jsonData;
        }
        stateManager.updateItemInState(this.config.stateNames.notes,note,isSameNote);
    }

    callbackDeleteNote(jsonData,httpStatus) {
        logger.log("Controller: Delete note callback",10);
        if (httpStatus >= 200 && httpStatus <= 299) { // do we have any data?
            logger.log(jsonData, 70);
        }
    }

}
