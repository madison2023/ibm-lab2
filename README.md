# Lab 2: User search application
Due date: July 5th, 2021 at 11:59 EST

## Introduction
In this lab, you are going to create a search application with React that utilizes a list of users from the Users resource on [JSON Placeholder](https://jsonplaceholder.typicode.com/). The application should display user information and have search and filtering capabilities, as defined in Requirements. On the web, [search algorithms](https://en.wikipedia.org/wiki/Search_algorithm) are implemented in different ways depending on how they calculate relevancy (think Google, Bing, DuckDuckGo, etc.). We want you to approach the search problem as a team and build out some UI functionality as a full-stack engineers. With your previous experience of Material UI and React, you can choose to develop the UI and your components as you see fit.

## Setup
  Pull /users data from [JSON Placeholder](https://jsonplaceholder.typicode.com/):
+ To see what the output looks like, try running
  `curl https://jsonplaceholder.typicode.com/users`
  in your terminal.
+ Use **asynchronous** calls to pull the data. Try using [axios for a GET request](https://careerkarma.com/blog/axios-get/).
+ The data is in JSON format. Check out [How to work with JSON in Javascript](https://www.digitalocean.com/community/tutorials/how-to-work-with-json-in-javascript).


## Requirements
The User Search App should be able to:
+ Display user information (at least name, email, phone, and city)
+ Remove entries from list (do not try to delete from databse, data will refresh on pull)
+ Search for users by name
+ Search for users by city
+ Sort users by city
