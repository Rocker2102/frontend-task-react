import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import style from './PlayAudio.module.css';

import { formatTime } from '../shared/utils';

const getLocalItems = () => {
    const list = window.localStorage.getItem('notes');

    if (list) { return JSON.parse(list) }

    return [];
};

export default class PlayAudio extends React.Component {
    static waveSurfer = null;

    audioInterval = undefined;

    constructor (props) {
        super(props);

        this.state = {
            notes: getLocalItems(),
            audio: {
                duration: 0,
                isPlaying: false,
                currentTime: null
            }
        };
    }

    displayTimer = (val, defVal = 'Loading ...') => {
        return typeof val === 'undefined' || isNaN(val)
            ? defVal
            : formatTime(val);
    }

    addNote = () => {
        const remark = window.prompt('Enter Note: ');

        if (!remark || remark === '') { return }

        console.log(this.state);
        this.setState({
            ...this.state,
            notes: [
                ...this.state.notes,
                {
                    time: PlayAudio.waveSurfer.getCurrentTime(),
                    remark,
                    audioName: this.props.audioFile?.name
                }
            ]
        });
        console.log(this.state);

        window.localStorage.setItem('notes', JSON.stringify(this.state.notes));
    }

    toggleAudio = () => {
        if (PlayAudio.waveSurfer === null) { return }

        PlayAudio.waveSurfer.playPause();

        if (PlayAudio.waveSurfer.isPlaying()) {
            this.setState({
                ...this.state,
                audio: {
                    ...this.state.audio,
                    isPlaying: false
                }
            });

            this.audioInterval = setInterval(() => {
                this.setState({
                    ...this.state,
                    audio: {
                        ...this.state.audio,
                        currentTime: PlayAudio.waveSurfer.getCurrentTime()
                    }
                });
            }, 500);

            return;
        }

        clearInterval(this.audioInterval);

        this.setState({
            ...this.state,
            audio: {
                ...this.state.audio,
                isPlaying: true
            }
        });
    };

    notesList = () => {
        const emptyList = <div>No notes added for this audio!</div>;

        if (this.state.notes.length !== 0) {
            const notesList = this.state.notes.filter((note) => note.audioName === this.props.audioFile?.name);

            if (notesList.length === 0) { return emptyList }

            return (
                <div>
                    {notesList.map(note => {
                        return <div key={note.time}>{formatTime(note.time)} - {note.remark}</div>
                    })}
                </div>
            );
        }

        return emptyList;
    }

    componentDidMount () {
        PlayAudio.waveSurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple'
        });

        if (typeof this.props.audioFile?.name !== 'string') { return }

        PlayAudio.waveSurfer.loadBlob(this.props.audioFile);

        PlayAudio.waveSurfer.on('ready', () => {
            this.setState({
                ...this.state,
                audio: {
                    ...this.state.audio,
                    duration: PlayAudio.waveSurfer.getDuration(),
                    currentTime: 0
                }
            });

            PlayAudio.waveSurfer.on('seek', () => {
                this.setState({
                    ...this.state,
                    audio: {
                        ...this.state.audio,
                        currentTime: PlayAudio.waveSurfer.getCurrentTime()
                    }
                });

                this.addNote();
            });
        });
    }

    render () {
        return (
            <div className={style.container}>
                <div className={style.waveForm}>
                    <div id="waveform"></div>
                </div>

                <div className={style.timer}>
                    <div>00:00</div>
                    <div>
                        { this.state.audio.currentTime == null
                            ? 'Loading ...'
                            : this.displayTimer(this.state.audio.currentTime) }
                    </div>
                    <div>{this.displayTimer(this.state.audio.duration, '00:00')}</div>
                </div>

                <div className={style.uiControls}>
                    <div>
                        <button type="button" onClick={this.toggleAudio} className={style.btn}>
                            {this.state.audio.isPlaying ? 'Pause' : 'Play'}
                        </button>
                    </div>
                </div>

                {this.notesList()}
            </div>
        );
    }
}
