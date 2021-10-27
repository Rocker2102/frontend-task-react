import React from 'react';

import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteForeverRounded';
import NoteAltIcon from '@mui/icons-material/NoteAltRounded';
import StickyNoteIcon from '@mui/icons-material/StickyNote2Rounded';
import PlayCircleIcon from '@mui/icons-material/PlayCircleRounded';
import DescriptionIcon from '@mui/icons-material/DescriptionRounded';
import TextSnipperIcon from '@mui/icons-material/TextSnippetRounded';

import { formatTime } from '../shared/utils';

export default class ShowNotes extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    getRandomIcon = () => {
        const icons = [ <NoteAltIcon />, <StickyNoteIcon />, <DescriptionIcon />,
            <TextSnipperIcon/> ];
        return icons[Math.floor(Math.random() * 10) % icons.length];
    }

    render() {
        if (this.props.notes?.length === 0) { return null }

        const iconStyle = { marginLeft: '2px' };

        return (
            <Paper elevation={8} sx={{
                margin: '0 1em',
                padding: '1em',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Typography variant="h5">
                    Notes you add will appear here
                </Typography>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {this.props.notes.map(note => {
                        return (
                            <ListItem key={note.time} secondaryAction={
                                <div>
                                    <Tooltip title="Resume from here" placement="top">
                                        <IconButton color="success" edge="end" style={iconStyle}
                                            onClick={() => this.props.resumeFromTime(note)}
                                        >
                                            <PlayCircleIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton edge="end" style={iconStyle} disabled>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" style={iconStyle} edge="end"
                                        onClick={() => this.props.removeNote(note)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            }>
                                <ListItemAvatar>
                                    <Avatar>
                                        {this.getRandomIcon()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={note.remark} secondary={formatTime(note.time)}
                                    sx={{
                                        textTransform: 'capitalize'
                                    }}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        );
    }
}
