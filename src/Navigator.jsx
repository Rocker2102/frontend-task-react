import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import PlayAudio from './components/PlayAudio';
import UploadForm from './components/UploadForm';

export default class Navigator extends React.Component {
    constructor() {
        super();

        this.state = {
            audioFile: null
        };
    }

    setAudioFile = (audioFile) => {
        this.setState({
            ...this.state,
            audioFile
        });
    }

    render () {
        return (
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <UploadForm setAudioFile={this.setAudioFile} />
                    </Route>
                    <Route path='/play-audio'>
                        <PlayAudio audioFile={this.state.audioFile} />
                    </Route>
                </Switch>
            </Router>
        );
    }
}
