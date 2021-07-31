import logger from './util/SimpleDebug.js';
import downloader from "./util/DownloadManager.js";
import stateManager from "./util/StateManagementUtil.js";
import isSameNote, { isSameNoteById } from "./util/EqualityFunctions.js";

var Controller = /*#__PURE__*/function () {
  function Controller(applicationView, clientSideStorage) {
    this.applicationView = applicationView;
    this.clientSideStorage = clientSideStorage; // setup event handlers and local storage access call

    this.handleEventSaveCurrentNote = this.handleEventSaveCurrentNote.bind(this);
    this.handleEventDeleteNote = this.handleEventDeleteNote.bind(this);
    this.handleEventAddNewNote = this.handleEventAddNewNote.bind(this); // setup Async callbacks for the fetch requests

    this.callbackGetAllNotes = this.callbackGetAllNotes.bind(this);
    this.callbackUpdateNote = this.callbackUpdateNote.bind(this);
    this.callbackDeleteNote = this.callbackDeleteNote.bind(this); // state listening

    this.stateChangeListenerForNotes = this.stateChangeListenerForNotes.bind(this);
  }

  var _proto = Controller.prototype;

  _proto.initialise = function initialise() {
    // load default saved states
    this.config = this.applicationView.state;
    stateManager.addChangeListenerForName(this.config.stateNames.notes, this.stateChangeListenerForNotes);
    document.getElementById(this.config.ui.navigation.addButtonId).addEventListener("click", this.handleEventAddNewNote);
    document.getElementById(this.config.ui.navigation.saveButtonId).addEventListener("click", this.handleEventSaveCurrentNote); // get initial state

    this.getAllNotes();
  } // update application state when changes occur
  ;

  _proto.stateChangeListenerForNotes = function stateChangeListenerForNotes(name, notes) {
    logger.log("State change received", 10);
    logger.log(notes);

    if (notes.length > 0) {
      logger.log("State change received > 0", 10); // has the previously selected note been deleted?

      var selectedNote = this.applicationView.state.selectedNote;

      if (selectedNote) {
        if (stateManager.isItemInState(this.config.stateNames.notes, selectedNote, isSameNote)) {
          logger.log("State change received - currently selected item still in state", 10); // stay on the same selected note

          this.applicationView.setState({
            notes: notes,
            selectedNote: selectedNote
          });
        } else {
          logger.log("State change received - currently selected item gone from state", 10); // go to the first note, the previously selected one is gone

          this.applicationView.setState({
            notes: notes,
            selectedNote: notes[0]
          });
        }
      } else {
        logger.log("State change received - there wasn't a selected note", 10); // no selected note

        this.applicationView.setState({
          notes: notes,
          selectedNote: null
        });
      }
    } else {
      logger.log("State change received - no notes left", 10); // no notes left to select

      this.applicationView.setState({
        notes: notes,
        selectedNote: null
      });
    }
  };

  _proto.handleEventAddNewNote = function handleEventAddNewNote(event) {
    logger.log("Controller: Adding new note", 10);
    event.preventDefault();
    logger.log("Controller: Saving new note", 10);
    var jsonRequest = {
      url: this.config.api.update,
      params: {
        type: "POST",
        title: "Title",
        note: "Note"
      },
      callback: this.callbackUpdateNote
    };
    downloader.addApiRequest(jsonRequest, true);
  };

  _proto.handleEventSaveCurrentNote = function handleEventSaveCurrentNote(event) {
    if (!document.getElementById(this.config.ui.noteDetails.noteIdElId)) return; // get the dom elements

    var noteIdEl = document.getElementById(this.config.ui.noteDetails.noteIdElId);
    var noteTitleEl = document.getElementById(this.config.ui.noteDetails.titleElId);
    var contentEl = document.getElementById(this.config.ui.noteDetails.contentElId);
    var noteId = noteIdEl.value;
    var noteTitle = noteTitleEl.value.trim();
    var noteContent = contentEl.value.trim();
    logger.log("Controller: Saving note with id " + noteId, 10);
    var jsonRequest = {
      url: this.config.api.update,
      params: {
        type: "POST",
        title: noteTitle,
        note: noteContent
      },
      callback: this.callbackUpdateNote
    };
    if (noteId && noteId !== "" && noteId !== -1) jsonRequest.params["id"] = noteId;
    downloader.addApiRequest(jsonRequest, true);
  };

  _proto.handleEventDeleteNote = function handleEventDeleteNote(event) {
    var noteId = event.target.getAttribute(this.config.data.id);
    logger.log("Controller: Deleting note with id " + noteId, 10);

    if (noteId) {
      // remove the item from the state manager
      var note = stateManager.findItemInState(this.config.stateNames.notes, noteId, isSameNoteById);

      if (note) {
        var jsonRequest = {
          url: this.config.api.delete,
          params: {
            type: "DELETE",
            id: noteId
          },
          callback: this.callbackDeleteNote
        };
        downloader.addApiRequest(jsonRequest);
        stateManager.removeItemFromState(this.config.stateNames.notes, note, isSameNote);
      }
    }
  };

  _proto.getAllNotes = function getAllNotes() {
    var jsonRequest = {
      url: this.config.api.get,
      params: {
        type: "GET"
      },
      callback: this.callbackGetAllNotes
    };
    downloader.addApiRequest(jsonRequest, true);
  }
  /* example interface used from the callback for FetchUtil */
  ;

  _proto.callbackGetAllNotes = function callbackGetAllNotes(jsonData, httpStatus) {
    logger.log("Controller: Get All Notes callback " + httpStatus, 10);
    var notes = [];

    if (httpStatus >= 200 && httpStatus <= 299) {
      // do we have any data?
      logger.log(jsonData, 70);
      notes = jsonData;
    }

    stateManager.setStateByName(this.config.stateNames.notes, notes);
  };

  _proto.callbackUpdateNote = function callbackUpdateNote(jsonData, httpStatus) {
    logger.log("Controller: Update note callback", 10);
    var note = {};

    if (httpStatus >= 200 && httpStatus <= 299) {
      // do we have any data?
      logger.log(jsonData, 70);
      note = jsonData;
    }

    stateManager.updateItemInState(this.config.stateNames.notes, note, isSameNote);
  };

  _proto.callbackDeleteNote = function callbackDeleteNote(jsonData, httpStatus) {
    logger.log("Controller: Delete note callback", 10);

    if (httpStatus >= 200 && httpStatus <= 299) {
      // do we have any data?
      logger.log(jsonData, 70);
    }
  };

  return Controller;
}();

export { Controller as default };