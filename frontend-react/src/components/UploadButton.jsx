import React from "react";
import { withRouter } from "react-router";

class UploadButton extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            file: null
        };
    }

    handleFile = (e) => {
        this.setState({
            ...this.state,
            file: e.target.files[0]
        });
    }

    onSubmit = (e) => {
        e.preventDefault();

        this.props.setFileName(this.state.file.name);
        this.props.setAudioFile(this.state.file);

        this.props.history.push("/play-audio");
    };

    render () {
        return (
            <div>
                <form onSubmit={this.onSubmit} style={{ marginBottom: "5px" }}>
                    <input type='file' onChange={this.handleFile} />
                    <button type='submit'>Upload audio</button>
                </form>
            </div>
        );
    }
}

export default withRouter(UploadButton);
