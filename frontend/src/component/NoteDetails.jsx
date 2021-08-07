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
                <div className="mt-2" id={uiConfig.detailsId}>
                    <form>
                        <input id={uiConfig.noteIdElId} type={"hidden"} value={note.id}></input>
                        <div className="form-group">
                            <input id={uiConfig.titleElId} type={"text"}
                                className={"form-control-lg"}
                                placeholder={"Note Title"} maxLength={"28"} value={note.title} onChange={this.changeTitleHandler}/>
                        </div>
                        <div className="form-group">
                            <textarea id={uiConfig.contentElId} className={"form-control"} placeholder={"Note Text"}
                                value={note.note} rows="5" onChange={this.changeNoteHandler}></textarea>
                        </div>
                         <button type="button" className={"btn btn-primary"} onClick={saveHandler}>Save <i className="fas fa-save text-white"></i></button>
                    </form>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }

}