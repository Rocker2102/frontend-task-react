import React from 'react';
import {
    Route,
    Switch,
    BrowserRouter as Router
} from 'react-router-dom';
import PlayAudio from './components/PlayAudio';
import UploadButton from './components/UploadButton';

export default class Navigator extends React.Component {
    constructor() {
        super();

        this.state = {
            fileName: null,
            audioFile: null
        };
    }

    setFileName = (fileName) => {
        this.setState({
            ...this.state,
            fileName
        });
    }

    setAudioFile = (audioFile) => {
        this.setState({
            ...this.state,
            audioFile
        });
    }

    render () {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path='/'>
                            <UploadButton setFileName={this.setFileName} setAudioFile={this.setAudioFile} />
                        </Route>
                        <Route path='/play-audio'>
                            <PlayAudio fileName={this.state.fileName} audioFile={this.state.audioFile} />
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}
