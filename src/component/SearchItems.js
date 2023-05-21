import React, { useState } from "react";

import PropTypes from 'prop-types';

import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import Popover from "@material-ui/core/Popover";
import { Typography } from "@material-ui/core";
import ColorScheme from "../styles/colorScheme";
import InfoIcon from "@material-ui/icons/Info";

/* Styling */
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 5, 2),
  },
  searchbar: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  button: {
    margin: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  headerText: {
    color: 'black',
  }
}));

/**
 * Checks whether a user matches the current queries.
 * 
 * @param {string} props the queries
 * @param {object} value the user object
 * @returns true if a user matches the current queries; false otherwise
 */
const entryMatchesQueries = (props, value) => {
  let nameDidMatch = false;

  if (props.nameQuery !== "") {
    if (value.name.toLowerCase().includes(props.nameQuery.toLowerCase())) {
      /** Both queries must be fulfilled before returning true. */
      if (props.cityQuery === "") return true;
      nameDidMatch = true;
    }
  }

  if (props.cityQuery !== "") {
    if (
      value.address.city.toLowerCase().includes(props.cityQuery.toLowerCase())
    ) {
      if (props.nameQuery === "" || nameDidMatch === true) return true;
    }
  }

  return false;
};

/** Info button to get company name and address. */
function MoreInfoButton(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  /** Show Popover upon clicking button. */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  /** Close Popover upon clicking elsewhere on the page. */
  const handleClose = () => {
    setAnchorEl(null);
  }
  
  const open = Boolean(anchorEl);
  const id = open ? "moreInfoButton" : undefined;

  let company = props.user.company.name;
  let building = `${props.user.address.street}, ${props.user.address.suite}`;
  let cityZip = `${props.user.address.city}, ${props.user.address.zipcode}`;
  let userInfo = `${company}: ${building}, ${cityZip}`; // Popover contents

  return (
    <>
      <IconButton
        style={{color:ColorScheme.lightBlue}}
        edge="end" 
        aria-label="info"
        aria-describedby={id}
        onClick={handleClick}
      >
        <InfoIcon/>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Typography className={classes.button}>{userInfo}</Typography>
      </Popover>
    </>
  );
}

MoreInfoButton.propTypes = {
  /** User object */
  user: PropTypes.object,
}

/** The displayed list of users. */
export default function SearchItems(props) {
  const [dense, setDense] = useState(false);
  const classes = useStyles();

  /**
   * Creates a new list of users, minus the deleted user.
   * 
   * @param {int} id the id of the user to delete
   */
  const handleDelete = (id) => {
    let newList = []
    props.displayList.forEach(element => {
      if (element.id !== id){
        newList.push(element);
      }
    });
    props.updateDisplayList(newList);
  }
  
  return ( 
    <>
      <Paper
        elevation={20}
        style={{
          marginTop: "1.5rem",
          backgroundColor: ColorScheme.darkYellow,
          height: "2rem",
        }}
      >
        <Grid container spacing={3} style={{ flex: 1 }}>
          <Grid item style={{ flex: 0.18, marginTop:'-0.5rem' }}>
            <Typography variant="overline" fontWeight="bold" className={classes.headerText}>
              Name/City
            </Typography>
          </Grid>
          <Grid item style={{ flex: 0.14, marginTop:'-0.5rem' }}>
            <Typography variant="overline" fontWeight="bold" className={classes.headerText}>
              email
            </Typography>
          </Grid>
          <Grid item style={{ flex: 0.41, marginTop:'-0.5rem' }}>
            <Typography variant="overline" fontWeight="bold" className={classes.headerText}>
              phone number
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    <List dense={dense} style={{ flex:1 }}>
      {props.displayList.map((value) => {
        if (
          (props.nameQuery === "" && props.cityQuery === "") ||
          entryMatchesQueries(props, value)
        ) {
          return (
            /** Setting the key fixes `each child in an array or iterator should have a unique “key” prop` error. */
            <Paper elevation={5} style={{marginTop:'0.2rem', backgroundColor:ColorScheme.fadedYellow}}>
            <ListItem key={value.id}>
              <ListItemAvatar style={{ flex: 0.02 }}>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                style={{ flex: 0.2 }}
                primary={value.name}
                secondary={value.address.city}
              />
              <Grid container style={{ flex: 0.7 }}>
                <Grid item style={{ flex: 0.4 }}>
                  {value.email}
                </Grid>
                <Grid item style={{ flex: 0.4 }}>
                  {value.phone}
                </Grid>
              </Grid>
              <ListItemSecondaryAction>
                <MoreInfoButton user={value} />
                <IconButton 
                  style={{color:ColorScheme.lightBlue}}
                  edge="end" 
                  aria-label="delete"
                  onClick={() => {
                    handleDelete(value.id)
                  }}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            </Paper>
          );
        }
      })}
    </List>
    </>
  );
}

SearchItems.propTypes = {
  /** City name search term */
  cityQuery: PropTypes.string,
  /** List of displayed user objects */
  displayList: PropTypes.array,
  /** User name search term */
  nameQuery: PropTypes.string,
  /** Function to modify list of displayed user objects */
  updateDisplayList: PropTypes.func,
}
