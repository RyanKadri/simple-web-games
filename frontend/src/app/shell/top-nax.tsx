import { AppBar, Typography, WithStyles, Theme, createStyles, Menu, withStyles, IconButton, MenuItem, Toolbar, Link } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu"
import React, { useState, SyntheticEvent } from "react";
import { Link as RouterLink } from 'react-router-dom';


const styles = (_: Theme) => createStyles({
    headerText: {
        flexGrow: 1
    }
})

const _TopBar = ({ classes }: Props) => {
    const [anchorEl, setAnchor] = useState<HTMLElement | null>(null);
    const onMenuOpen = (e: SyntheticEvent<HTMLElement>) => { setAnchor(e.currentTarget) };
    const onMenuClose = () => { setAnchor(null) };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" color="inherit" className={ classes.headerText }>
                    Simple Web Games
                </Typography>
                <IconButton onClick={onMenuOpen} color="inherit">
                    <MenuIcon></MenuIcon>
                </IconButton>
                <Menu open={!!anchorEl} onClose={onMenuClose} anchorEl={anchorEl}>
                    <MenuItem><Link component={RouterLink as any} { ...{to: "tic-tac-toe"}}>Tic Tac Toe</Link></MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
};

export const TopBar = withStyles(styles)(_TopBar);

interface Props extends WithStyles<typeof styles> {

}