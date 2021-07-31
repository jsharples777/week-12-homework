function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import logger from "../util/SimpleDebug.js";
import browserUtil from "../util/BrowserUtil.js";

var NoteDetails = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(NoteDetails, _React$Component);

  function NoteDetails() {
    var _this;

    _this = _React$Component.call(this) || this;
    _this.state = {
      selectedNote: null
    };
    _this.changeTitleHandler = _this.changeTitleHandler.bind(_assertThisInitialized(_this));
    _this.changeNoteHandler = _this.changeNoteHandler.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = NoteDetails.prototype;

  _proto.changeTitleHandler = function changeTitleHandler(event) {
    this.props.note.title = event.target.value;
    this.setState({
      selectedNote: this.props.note
    });
  };

  _proto.changeNoteHandler = function changeNoteHandler(event) {
    this.props.note.note = event.target.value;
    this.setState({
      selectedNote: this.props.note
    });
  };

  _proto.render = function render() {
    var note = this.props.note;
    var saveHandler = this.props.saveHandler;
    var uiConfig = this.props.uiConfig;
    logger.log("Note Details: render", 2);
    logger.log(note);

    if (note && note.title != null) {
      return /*#__PURE__*/React.createElement("div", {
        id: uiConfig.detailsId
      }, /*#__PURE__*/React.createElement("input", {
        id: uiConfig.noteIdElId,
        type: "hidden",
        value: note.id
      }), /*#__PURE__*/React.createElement("input", {
        id: uiConfig.titleElId,
        type: "text",
        className: "note-title",
        placeholder: "Note Title",
        maxLength: "28",
        value: note.title,
        onChange: this.changeTitleHandler
      }), /*#__PURE__*/React.createElement("textarea", {
        id: uiConfig.contentElId,
        className: "note-textarea",
        placeholder: "Note Text",
        value: note.note,
        onChange: this.changeNoteHandler
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "btn btn-primary",
        onClick: saveHandler
      }, "Save ", /*#__PURE__*/React.createElement("i", {
        className: "fas fa-save text-white"
      })));
    } else {
      return /*#__PURE__*/React.createElement("div", null);
    }
  };

  return NoteDetails;
}(React.Component);

export { NoteDetails as default };