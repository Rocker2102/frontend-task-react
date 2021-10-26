import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AudioIcon from '@mui/icons-material/AudiotrackRounded';
import BackupIcon from '@mui/icons-material/BackupRounded';
import { withRouter } from 'react-router';

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
            file: e.target.files[0] ?? null
        });
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (! this.state.file) { return }

        this.props.setFileName(this.state.file.name);
        this.props.setAudioFile(this.state.file);

        this.props.history.push('/play-audio');
    };

    render () {
        return (
            <Box sx={{
                display: 'flex',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center'
             }}>
                <form onSubmit={this.onSubmit}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <label htmlFor="contained-button-file">
                            <input accept=".mp3, .wav, .aac, .wma, .m4a"
                                id="contained-button-file" type="file"
                                style={{ display: 'none' }}
                                onChange={this.handleFile}
                            />
                            <Button variant="outlined" component="span" startIcon={<AudioIcon />}>
                                Select Audio
                            </Button>
                        </label>
                        <Button type="submit" component="button" variant="contained"
                            color="success"
                            endIcon={<BackupIcon />}
                            disabled={this.state.file === null ? true : false}
                        >
                            Upload
                        </Button>
                    </Stack>
                </form>
            </Box>
        );
    }
}

export default withRouter(UploadButton);
