import logger from './util/SimpleDebug.js'
import Controller from "./Controller.js";
import stateManager from "./util/StateManagementUtil.js";
import {isSameNoteById} from "./util/EqualityFunctions.js";
import NoteDetails from "./component/NoteDetails.js";

class App extends React.Component {

    constructor() {
        super();
        logger.setOff();
        logger.setLevel(0);
        this.state = {
            notes: [],
            selectedNote: null,
            api: {
                update: "/api/notes",
                delete: "/api/notes",
                get: "/api/notes"
            },
            stateNames: {
                notes: "notes",
                selectedNote: "selectedNote",
            },
            data: {
                id: "note-id"
            },
            ui: {
                noteDetails: {
                    detailsId: "detailsId",
                    noteIdElId: "noteId",
                    titleElId: "noteTitleId",
                    contentElId: "noteContentId",
                },
                navigation: {
                    addButtonId: "addNote",
                    saveButtonId: "saveNote",
                }
            }
        };
        this.controller = new Controller(this,window.localStorage);

        this.handleEventSelectNote = this.handleEventSelectNote.bind(this);

    }

    handleEventSelectNote(event) {
        event.preventDefault();
        let noteId = event.target.getAttribute(this.state.data.id);
        logger.log(`App: handling note selection ${noteId}`,1);
        if (noteId) {
            let note = stateManager.findItemInState(this.state.stateNames.notes, noteId, isSameNoteById);
            if (note) {
                logger.log(`App: selecting note selection ${note.id}`,1);
                this.setState({selectedNote:note});
            }
        }
    }

    render() {
        logger.log("App: rendering",1);
        const noteItems = this.state.notes.map((note,index) =>
            <li key={index} className={"list-group-item"}
                onClick={this.handleEventSelectNote} note-id={note.id}>
                {note.title}
                <i className={"fas fa-trash-alt float-right text-danger"} onClick={this.controller.handleEventDeleteNote} note-id={note.id}></i>
            </li>
        );

        return (
            <div id="App" className="App">
                <div className={"container-fluid"}>
                    <div className={"row"}>
                        <div className={"col-4 list-container"}>
                            <div className={"card"}>
                                <ul className={"list-group"}>
                                    {noteItems}
                                </ul>
                            </div>
                        </div>
                        <div className={"col-8"}>
                            <NoteDetails note={this.state.selectedNote} uiConfig={this.state.ui.noteDetails} saveHandler={this.controller.handleEventSaveCurrentNote}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        // load the initial state
        this.controller.initialise();
    }
}


const element = <App className={"container-fluid"}/>

ReactDOM.render(element, document.getElementById("root"));
