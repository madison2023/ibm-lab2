import React, { useState, useEffect } from "react";

import PropTypes from 'prop-types';

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Select from "@material-ui/core/Select";
import ColorScheme from "../styles/colorScheme";
import TextField from "@material-ui/core/TextField";


/* Styling */
const useStyles = makeStyles((theme) => ({
  root: {
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
}));

/** Button to restore deleted entries. */
function RestoreButton(props) {
  const classes = useStyles();

  /**
   * `disabled` will only be false if the player has removed any entries.
   * (if length of entireList differs from length of displayList)
   */
  return (
    <Button
      variant="contained"
      size="large"
      disabled={(props.entireList.length === props.displayList.length) ? true : false}
      style={{backgroundColor: ColorScheme.gray}}
      className={classes.button}
      endIcon={<RestoreFromTrashIcon />}
      onClick={() => {
        props.restoreEntireList();
      }}
    >
      Restore
    </Button>
  );
}

RestoreButton.propTypes = {
  /** Function that restores list of users to original state (no deletions) */
  restoreEntireList: PropTypes.func,
}

/** Select drop-down menu to pick sort type for the list of search results. */
function SortSelect(props) {
  const classes = useStyles();

  // state can be used outside of handleChange() to get the current sort:
  const [state, setState] = React.useState({
    sortby: "f",
  });
  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  // Any time the sort menu changes, keep track of current sort selection:
  useEffect(() => {
    if (state.sortby === "f") { // first name sort
      nameSort(props.list, props.setList, false);
    } else if (state.sortby === "l") { // last name sort
      nameSort(props.list, props.setList, true);
    } else if (state.sortby === "c") { // city name sort
      citySort(props.list, props.setList);
    } else if (state.sortby === "d") { // distance from user sort
      distanceSort(props.list, props.setList);
    }
  }, [state]);

  /**
   * Given a user object, get either the first or last name.
   * 
   * @param {object} user the user whose name we'll parse
   * @param {boolean} lastName true for last name, false for first name
   * @returns either the user's first or last name
   */
  function parseNames(user, lastName) {
    const parseFullName = require("parse-full-name").parseFullName;
    if (lastName) {
      return parseFullName(user.name, "last");
    } else {
      return parseFullName(user.name, "first");
    }
  }

  /**
   * Given a list of user objects to sort and a function to mutate it with, sort
   * them alphabetically by name.
   * 
   * @param {array} list user objects
   * @param {function} setList function to mutate list of user objects
   * @param {boolean} lastName sort by last name (true) or first name (false)
   */
   function nameSort(list, setList, lastName) {
    let sorted = [...list]; // sorted is displayList from App
    sorted.sort((a, b) =>
      parseNames(a, lastName) > parseNames(b, lastName) ? 1 : -1
    );
    setList(sorted);
  }

  /**
   * Given a list of user objects to sort and a function to mutate it with, sort
   * them alphabetically by city name.
   * 
   * @param {array} list user objects
   * @param {function} setList function to mutate list of user objects
   */
  function citySort(list, setList) {
    let sorted = [...list]; // sorted is displayList from App
    sorted.sort((a, b) => (a.address.city > b.address.city) ? 1 : -1);
    setList(sorted);
  }

  // Get user's location (if something goes wrong, no option to distance sort)
  const [myLat, setMyLat] = useState(NaN);
  const [myLong, setMyLong] = useState(NaN);
  const [enableDistSort, setEnableDistSort] = useState(true);
  // useEffect ensures myLat and myLong aren't accessed before getting set:
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ((position) => { // successfully read position
          setMyLat(position.coords.latitude);
          setMyLong(position.coords.longitude);
          setEnableDistSort(true);
        }), (() => { // error (permissions denied, etc.)
          setEnableDistSort(false);
        })
      )
    }
  });

  /**
   * Given the latitude and longitude of two points on the roughly spherical
   * Earth, calculates the approximate distance between them in km.
   * 
   * @param {number} myLat latitude of the first point
   * @param {number} theirLat latitude of the second point
   * @param {number} myLong longitude of the first point
   * @param {number} theirLong longitude of the second point
   * @returns approximate distance between points 1 and 2 in m
   * @see https://en.wikipedia.org/wiki/Haversine_formula
   */
  function getDistance(myLat, theirLat, myLong, theirLong) {
    const R = 6371e3; // radius of the Earth in m
    let lat1 = myLat * Math.PI/180; // converting to degrees
    let lat2 = theirLat * Math.PI/180;
    let long1 = myLong * Math.PI/180;
    let long2 = theirLong * Math.PI/180;
    const a = Math.sin((lat2-lat1)/2) * Math.sin((lat2-lat1)/2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin((long2-long1)/2) *
      Math.sin((long2-long1)/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // distance in m
  }

  /**
   * Given a list of user objects to sort and a function to mutate it with, sort
   * them from closest to furthest from the client's coordinates.
   * 
   * @param {array} list 
   * @param {function} setList 
   */
  function distanceSort(list, setList) {
    const sorted = list.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      address: u.address,
      phone: u.phone,
      website: u.website,
      company: u.company,
      distance: getDistance(myLat, u.address.geo.lat, myLong, u.address.geo.lng)
    }));
    sorted.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    setList(sorted);
  }

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel htmlFor="sort-select">Sort</InputLabel>
      <Select
        native
        value={state.sortby}
        onChange={handleChange}
        label="Sort"
        inputProps={{
          name: "sortby",
          id: "sort-select",
        }}
      >
        <option value={"f"}>First name, A-Z</option>
        <option value={"l"}>Last name, A-Z</option>
        <option value={"c"}>City, A-Z</option>
        {enableDistSort && <option value={"d"}>Distance</option>}
      </Select>
    </FormControl>
  );
}

SortSelect.propTypes = {
  /** List to sort upon changing state of drop-down menu */
  list: PropTypes.array,
  /** Function to update that list */
  setList: PropTypes.func,
};

/**
 * Renders two search text fields, a sort type drop-down menu, and a search
 * button to search through a list of user objects.
 */
export default function SearchBars(props) {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="CitySearch"
          label="City"
          variant="outlined"
          onChange={props.updateCityQuery}
        />
        <TextField
          id="NameSearch"
          label="Name"
          variant="outlined"
          onChange={props.updateNameQuery}
        />
      <SortSelect list={props.displayList} setList={props.updateDisplayList}/>
      <RestoreButton entireList={props.entireList} displayList={props.displayList} restoreEntireList={props.restoreEntireList}/>
    </form>
  );
}

SearchBars.propTypes = {
  /** List of search results to display */
  displayList: PropTypes.array,
  /** Function to update the city query */
  updateCityQuery: PropTypes.func,
  /** Function to update the list of search results to display */
  updateDisplayList: PropTypes.func,
  /** Function to update the name query */
  updateNameQuery: PropTypes.func,
};
