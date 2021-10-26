import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BackupIcon from '@mui/icons-material/BackupRounded';
import AudioIcon from '@mui/icons-material/AudiotrackRounded';
import { withRouter } from 'react-router';

import { formatFileSize } from '../shared/utils';

function DisplayFileInfo({ file }) {
    if (! file) { return null }

    return (
        <Box sx={{
            dispay: 'flex',
            marginTop: '12px',
            alignItems: 'flex-start',
         }}>
            <Typography variant="h5">
                Information about current file
            </Typography>
            <Typography variant="subtitle1">
                <strong>Name: </strong> {file.name}
            </Typography>
            <Typography variant="subtitle1">
                <strong>Size: </strong> {formatFileSize(file.size)}
            </Typography>
            <Typography variant="subtitle1">
                <strong>Type: </strong> {file.type}
            </Typography>
        </Box>
    );
}

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
        const inputBtnId = "audio-file";

        return (
            <Box sx={{
                display: 'flex',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center'
             }}>
                <form onSubmit={this.onSubmit}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <label htmlFor={inputBtnId}>
                            <input accept=".mp3, .wav, .aac, .wma, .m4a"
                                id={inputBtnId} type="file"
                                style={{ display: 'none' }}
                                onChange={this.handleFile}
                            />
                            <Button variant="outlined" component="span" startIcon={<AudioIcon />}>
                                Select Audio File
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

                    <DisplayFileInfo file={this.state.file} />
                </form>
            </Box>
        );
    }
}

export default withRouter(UploadButton);
