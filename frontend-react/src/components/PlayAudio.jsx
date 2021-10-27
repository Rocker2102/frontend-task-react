import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';

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
import ShowNotes from './ShowNotes';

import WaveSurfer from 'wavesurfer.js';

import { formatTime } from '../shared/utils';

const getLocalItems = (key) => {
    const list = window.localStorage.getItem(key);

    if (list) { return JSON.parse(list) }

    return [];
};

export default class PlayAudio extends React.Component {
    static waveSurfer = null;

    lsKey = 'notes';
    maxAudioSteps = 15;
    audioInterval = undefined;

    constructor (props) {
        super(props);

        this.state = {
            notes: getLocalItems(this.lsKey),
            audio: {
                volume: 4,
                isMute: false,
                duration: 0,
                isPlaying: false,
                currentTime: null
            },
            theme: 'light'
        };
    }

    getTheme = (mode) => {
        return createTheme({
            palette: {
                mode: mode
            }
        });
    }

    toggleTheme = () => {
        if (this.state.theme === 'light') {
            this.setState({
                ...this.state,
                theme: 'dark'
            });
        } else {
            this.setState({
                ...this.state,
                theme: 'light'
            });
        }
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

        window.localStorage.setItem(this.lsKey, JSON.stringify(this.state.notes));
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
        if (this.state.notes.length !== 0) {
            const notesList = this.state.notes.filter((note) => note.audioName === this.props.audioFile?.name);

            if (notesList.length === 0) { return [] }

            return notesList;
        }

        return [];
    }

    removeNote = (noteData) => {
        const newNotes = this.state.notes.filter(note => {
            if (note.audioName === noteData.audioName && note.time === noteData.time) {
                return false;
            }
            return true;
        });

        this.setState({
            ...this.state,
            notes: newNotes
        });

        window.localStorage.setItem(this.lsKey, JSON.stringify(newNotes));
    }

    resumeFromTime = (note) => {
        console.log(note);
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
            <ThemeProvider theme={this.getTheme(this.state.theme)}>
                <CssBaseline />

                <Box>
                    <TopMenu title={this.props.audioFile?.name}
                        currentTheme={this.state.theme} toggleTheme={this.toggleTheme}
                    />

                    <Container sx={{ marginTop: '2em' }}>
                        <Paper elevation={0} sx={{ padding: '2em 1em 0.6em 1em' }}>
                            <Box sx={{
                                borderBottom: '1px solid black',
                                marginBottom: '2px'
                            }}>
                                <div id="waveform"></div>
                            </Box>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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

                        <ShowNotes
                            notes={this.notesList()} resumeFromTime={this.resumeFromTime}
                            removeNote={this.removeNote}
                        />
                    </Container>
                </Box>
            </ThemeProvider>
        );
    }
}
