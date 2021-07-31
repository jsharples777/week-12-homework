import logger from "../util/SimpleDebug.js";
import browserUtil from "../util/BrowserUtil.js";

export default class NoteDetails extends React.Component {

    constructor() {
        super();
        this.state = {selectedNote:null};
        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeNoteHandler = this.changeNoteHandler.bind(this);
    }

    changeTitleHandler (event) {
        this.props.note.title = event.target.value;
        this.setState({selectedNote:this.props.note});
    }

    changeNoteHandler (event) {
        this.props.note.note = event.target.value;
        this.setState({selectedNote:this.props.note});
    }

    render() {
        let note = this.props.note;
        let saveHandler = this.props.saveHandler;
        let uiConfig = this.props.uiConfig;

        logger.log("Note Details: render", 2);
        logger.log(note);

        if (note  && (note.title != null)) {
            return (
                <div id={uiConfig.detailsId}>
                    <input id={uiConfig.noteIdElId} type={"hidden"} value={note.id}></input>
                    <input id={uiConfig.titleElId} type={"text"}
                           className={"note-title"}
                           placeholder={"Note Title"} maxLength={"28"} value={note.title} onChange={this.changeTitleHandler}/>
                    <textarea id={uiConfig.contentElId} className={"note-textarea"} placeholder={"Note Text"}
                              value={note.note} onChange={this.changeNoteHandler}></textarea>
                    <button type="button" className={"btn btn-primary"} onClick={saveHandler}>Save <i
                        className="fas fa-save text-white"></i></button>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }

}