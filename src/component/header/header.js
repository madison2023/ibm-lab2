import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ColorScheme from '../../styles/colorScheme';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: 'black',
    letterSpacing: '0.3rem'
  },
  appBar: {
    marginBottom: '2rem',
    paddingTop: '1rem'
  },
}));

export default function Header(){
    const classes = useStyles();
    return <div className={classes.root}>
    <AppBar position="static" style={{backgroundColor: ColorScheme.darkYellow}} class={classes.appBar}>
      <Toolbar>
        <Typography variant="h4" className={classes.title}>
          The Yellow Page
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
}