import React from 'react';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';
import PlayIcon from '@mui/icons-material/PlayArrowRounded';
import PauseIcon from '@mui/icons-material/PauseRounded';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import VolumeUpIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffIcon from '@mui/icons-material/VolumeOffOutlined';

import TopMenu from './TopMenu';

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

    maxAudioSteps = 15;
    audioInterval = undefined;

    constructor (props) {
        super(props);

        this.state = {
            notes: getLocalItems(),
            audio: {
                volume: 4,
                isMute: false,
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

        window.localStorage.setItem('notes', JSON.stringify(this.state.notes));
    }

    toggleMute = () => {
        if (PlayAudio.waveSurfer === null) { return }

        let mute = true;

        if (PlayAudio.waveSurfer.getMute()) {
            mute = false;
        }

        PlayAudio.waveSurfer.setMute(mute);
        this.setState({
            ...this.state,
            audio: {
                ...this.state.audio,
                isMute: mute
            }
        });
    }

    toggleAudioPlayback = () => {
        if (PlayAudio.waveSurfer === null) { return }

        const refreshRate = 500;
        PlayAudio.waveSurfer.playPause();

        if (PlayAudio.waveSurfer.isPlaying()) {
            this.setState({
                ...this.state,
                audio: {
                    ...this.state.audio,
                    isPlaying: true
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
            }, refreshRate);

            return;
        }

        clearInterval(this.audioInterval);

        this.setState({
            ...this.state,
            audio: {
                ...this.state.audio,
                isPlaying: false
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

    handleVolumeChange = (e, value) => {
        if (PlayAudio.waveSurfer === null) { return }

        if (value instanceof Array) {
            value = value.length > 0 ? value[0] : 0;
        }

        PlayAudio.waveSurfer.setVolume(value / this.maxAudioSteps);
        PlayAudio.waveSurfer.setMute(false);

        this.setState({
            ...this.state,
            audio: {
                ...this.state.audio,
                volume: value,
                isMute: false
            }
        });
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
            this.handleVolumeChange(null, this.state.audio.volume);

            this.setState({
                ...this.state,
                audio: {
                    ...this.state.audio,
                    duration: PlayAudio.waveSurfer.getDuration(),
                    currentTime: 0
                }
            });
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

        PlayAudio.waveSurfer.on('error', () => {
            console.log('An error occurred!');
        });

        PlayAudio.waveSurfer.on('finish', () => {
            console.log('Audio clip finished!');

            this.setState({
                ...this.state,
                audio: {
                    ...this.state.audio,
                    isPlaying: false,
                    currentTime: 0
                }
            });
        });
    }

    componentWillUnmount () {
        clearInterval(this.audioInterval);
        PlayAudio.waveSurfer?.destroy();
    }

    render () {
        return (
            <Box>
                <TopMenu title={this.props.audioFile?.name} />

                <Container sx={{ marginTop: '2em' }}>
                    <Paper elevation={0} sx={{ padding: '2em 1em', marginBottom: '1em' }}>
                        <Box sx={{
                            borderBottom: '1px solid black',
                            marginBottom: '2px'
                        }}>
                            <div id="waveform"></div>
                        </Box>

                        <div className={style.timer}>
                            <div>00:00</div>
                            <div>
                                { this.state.audio.currentTime == null
                                    ? 'Loading ...'
                                    : this.displayTimer(this.state.audio.currentTime) }
                            </div>
                            <div>
                                {this.displayTimer(this.state.audio.duration, '00:00')}
                            </div>
                        </div>
                    </Paper>

                    <Grid container sx={{ display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        padding: '0 1em',
                        marginBottom: '2em'
                    }}>
                        <Grid item xs={4}>
                            <Fab color="secondary" size="large"
                                onClick={this.toggleAudioPlayback}
                            >
                                {
                                    this.state.audio.isPlaying
                                        ? <PauseIcon fontSize="large" />
                                        : <PlayIcon fontSize="large" />
                                }
                            </Fab>
                        </Grid>

                        <Grid item md={3} xs={5}>
                            <Stack direction="row" alignItems="center"
                                spacing={{ xs: 0, lg: 0.5 }} justifyContent='flex-end'
                            >
                                <Tooltip title="Toggle Mute" placement="left">
                                    <IconButton color="primary" onClick={this.toggleMute}>
                                        {this.state.audio.isMute ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                    </IconButton>
                                </Tooltip>

                                <Slider size="small"
                                    min={0} max={this.maxAudioSteps} step={1}
                                    value={this.state.audio.volume}
                                    onChange={this.handleVolumeChange}
                                    valueLabelDisplay="auto"
                                />
                            </Stack>
                        </Grid>
                    </Grid>

                    {this.notesList()}
                </Container>
            </Box>
        );
    }
}
