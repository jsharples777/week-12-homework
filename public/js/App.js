function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import logger from './util/SimpleDebug.js';
import Controller from "./Controller.js";
import stateManager from "./util/StateManagementUtil.js";
import { isSameNoteById } from "./util/EqualityFunctions.js";
import NoteDetails from "./component/NoteDetails.js";

var App = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(App, _React$Component);

  function App() {
    var _this;

    _this = _React$Component.call(this) || this;
    logger.setOn();
    logger.setLevel(10);
    _this.state = {
      notes: [],
      selectedNote: null,
      api: {
        update: "/api/notes",
        delete: "/api/notes",
        get: "/api/notes"
      },
      stateNames: {
        notes: "notes",
        selectedNote: "selectedNote"
      },
      data: {
        id: "note-id"
      },
      ui: {
        noteDetails: {
          detailsId: "detailsId",
          noteIdElId: "noteId",
          titleElId: "noteTitleId",
          contentElId: "noteContentId"
        },
        navigation: {
          addButtonId: "addNote",
          saveButtonId: "saveNote"
        }
      }
    };
    _this.controller = new Controller(_assertThisInitialized(_this), window.localStorage);
    _this.handleEventSelectNote = _this.handleEventSelectNote.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = App.prototype;

  _proto.handleEventSelectNote = function handleEventSelectNote(event) {
    event.preventDefault();
    var noteId = event.target.getAttribute(this.state.data.id);
    logger.log("App: handling note selection " + noteId, 1);

    if (noteId) {
      var note = stateManager.findItemInState(this.state.stateNames.notes, noteId, isSameNoteById);

      if (note) {
        logger.log("App: selecting note selection " + note.id, 1);
        this.setState({
          selectedNote: note
        });
      }
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    logger.log("App: rendering", 1);
    var noteItems = this.state.notes.map(function (note, index) {
      return /*#__PURE__*/React.createElement("li", {
        key: index,
        className: "list-group-item",
        onClick: _this2.handleEventSelectNote,
        "note-id": note.id
      }, note.title, /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash-alt float-right text-danger",
        onClick: _this2.controller.handleEventDeleteNote,
        "note-id": note.id
      }));
    });
    return /*#__PURE__*/React.createElement("div", {
      id: "App",
      className: "App"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-fluid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-4 list-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "list-group"
    }, noteItems))), /*#__PURE__*/React.createElement("div", {
      className: "col-8"
    }, /*#__PURE__*/React.createElement(NoteDetails, {
      note: this.state.selectedNote,
      uiConfig: this.state.ui.noteDetails,
      saveHandler: this.controller.handleEventSaveCurrentNote
    })))));
  };

  _proto.componentDidMount = function componentDidMount() {
    // load the initial state
    this.controller.initialise();
  };

  return App;
}(React.Component);

var element = /*#__PURE__*/React.createElement(App, {
  className: "container-fluid"
});
ReactDOM.render(element, document.getElementById("root"));