import React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBackRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default class TopMenu extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Link to="/" style={{ color: '#fff' }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Link>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {this.props.title}
                        </Typography>

                        <IconButton
                            color="inherit"
                            onClick={this.props.toggleTheme}
                        >
                            {this.props.currentTheme === 'dark'
                                ? <Brightness7Icon />
                                : <Brightness4Icon />
                            }

                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
}
