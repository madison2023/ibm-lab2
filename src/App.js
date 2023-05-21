import React, { useState, useEffect, useCallback } from "react";
import Header from "./component/header";
import SearchItems from "./component/SearchItems";
import SearchBars from "./component/SearchBars";
import Container from "@material-ui/core/Container";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import axios from "axios";
import "./App.css";  
import ColorScheme from "./styles/colorScheme";

const headerTheme = createMuiTheme({
  typography: {
    fontFamily: "Berkshire Swash, cursive"
  }
});

const theme = createMuiTheme({
  typography: {
    fontFamily: "Roboto, sans-serif"
  },
  palette: {
    primary: {
      main: ColorScheme.lightBlue
    }
  }
});

function App() {
  // we store the state of these queries here so that the `SearchItems` component may also access it
  const [cityQuery, setCityQuery] = useState("");
  const [nameQuery, setNameQuery] = useState("");

  // get entire JSON as list of objects
  const [entireList, setEntireList] = useState([]); // entire JSON, leave alone
  const [displayList, setDisplayList] = useState([]); // list to actually display

  /**
   * Given a user object, returns the first name.
   * 
   * @param {object} user the user whose name we'll parse
   * @returns the user's first name
   */
  function parseNames(user) {
    const parseFullName = require("parse-full-name").parseFullName;
    return parseFullName(user.name, "first");
  }

  const getPostData = useCallback(async () => {
    axios
      .get("https://jsonplaceholder.typicode.com/users").then(jsonData => {
        setEntireList(jsonData.data);
        setDisplayList((jsonData.data).sort((a, b) => parseNames(a) > parseNames(b) ? 1 : -1));
      }).catch(error => console.log(error));
  }, []); // empty array means run only once
  useEffect(() => {
    getPostData()
  }, []); // empty array means run only once

  /**
   * Function to assign setCityQuery() to the city search field.
   * 
   * @param {Event} e accesses the value in the text field DOMNode via e.target
   */
  const updateCityQuery = (e) => {
    setCityQuery(e.target.value);
  };

  /**
   * Function to assign setNameQuery() to the name search field.
   * 
   * @param {Event} e accesses the value in the text field DOMNode via e.target
   */
  const updateNameQuery = (e) => {
    setNameQuery(e.target.value);
  };

  /**
   * Function to assign setDisplayList() to the sort select menu and delete buttons.
   * 
   * @param {array} newList the new list to set as displayList
   */
  const updateDisplayList = (newList) => {
    setDisplayList(newList);
  }

  /** Function to restore displayList, to assign to the restore button. */
  const restoreEntireList = () => {
    setDisplayList(entireList);
  }

  return (
    <div className="App">
      <MuiThemeProvider theme={headerTheme}>
        <Header />

        <MuiThemeProvider theme={theme}>
          <SearchBars
            entireList={entireList}
            displayList={displayList}
            updateDisplayList={updateDisplayList}
            updateCityQuery={updateCityQuery}
            updateNameQuery={updateNameQuery}
            restoreEntireList={restoreEntireList}
          />
          <Container fixed>
            <SearchItems
              updateDisplayList={updateDisplayList}
              displayList={displayList}
              cityQuery={cityQuery}
              nameQuery={nameQuery}
            />
          </Container>
        </MuiThemeProvider>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
