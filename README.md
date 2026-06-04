# CampusPath
National University of Singapore  
Orbital Project 2026  
Built by  
- Foong Qi Ming  
- Joshua Lee  

### A pathfinding application designed for the National University of Singapore (NUS) campus, helping users navigate from one location to another with optimized routes.
---

# Table of Contents
- [Overview](#overview)
- [Project Motivation](#project-motivation)
  - [Problem Statement](#problem-statement)
  - [Solution](#solution)
- [Features](#features)
- [Techstack](#techstack)
- [System Design](#system-design)
- [Implementation](#implementation)
  - [API](#api)
  - [pathfinding](#pathfinding)
- [Software Engineering Practices](#software-engineering-practices)
  - [Version Control](#version-control)
  - [Software Testing](#software-testing)
- [Development Timeline](#development-timeline)
- [Installation](#installation)
---

# Overview
CampusPath provides navigation between campus locations such as lecture halls, classrooms, and facilities. Unlike traditional GPS systems, it is designed to handle indoor and campus-specific navigation, where standard tools often fail.

---
# Project Motivation

## Problem Statement
Every start of a new semester, students are thrown into new classrooms and lecture halls. Much time is spent on navigating to our new classrooms due to unfamilarity with the place.  
When it rains we need to take detours to our next venue to keep ourselves dry. This incurs additonal navigation time which may lead to us being late for class.  
What if we just used Google maps or other available maps?  
Flaws of current GPS-based navigation systems:
- Struggle with indoor navigation
- Do not account for campus-specific pathways
- Cannot optimize for preferences like shelter or accessibility



## Solution
CampusPath addresses these limitations by:
- Allowing users to input a starting location and destination
- Computing the most optimal route based on selected conditions:
  - Shortest distance
  - Sheltered paths (for rain)
  - Accessibility (wheelchair-friendly routes)
- Supporting indoor and outdoor navigation

---

# Features
- Location Searching function to allow user to select their destination as well as start. (Core feature)
- 3 Optimisation options for users to optimise their path by either fastest, most sheltered for rainy days and accessbility. (Core feature)
- History page to allow users to quickly refer to their recent searches (Extra feature)
- Favoriting paths to keep them at the top of history page for quick access (Extra feature)
- Accounts to sync history and favorites across devices (Extension feature)

## Userflow
<img width="3344" height="1508" alt="image" src="https://github.com/user-attachments/assets/c50bd25b-08ec-4eb6-a212-621f87836f28" />

---

# Techstack
We are using MERN Techstack (MongoDB, Express js, React native, Node js)
### Frontend
We decided to build a mobile application similar to NUS NextBus for ease of access. Therefore, we decided to build our app with React Native an UI software framework that builds mobile applications for iOS and Android as our frontend to save us trouble for different platform deployment.  
For ease of development we opted for the React native Expo App framework which nicely sets up development environment.

### Database
For the database we choose MongoDB which has developer-friendly JSON-like data structure, and ability to easily scale. This allow us to store map data which is essential for path computation.  
MongoDB also has Atlas MongoDB which allows developers to host database clusters with nice interface to work with.  

### Backend
With both our frontend and database decided. We opt for Node Js express framework which will simplify and help with our API routing. Combined with Vercel serverless hosting of our backend, this sets up our locations searching API as well as path computation to be available without our own hardware.

| Tech | Our Version | Installation guide |
| :---- | :---- | :---- |
| Node js | v24.15.0 | https://nodejs.org/en/download |
| React native | 0.81.5 | https://docs.expo.dev/tutorial/create-your-first-app/ |
| MongoDB | \- | <code> npm install mongoose  </code> |
| Atlas Database | \- | https://www.mongodb.com/products/platform/atlas-database |
| Vercel | \- | https://vercel.com |
---

# System Design
<img width="3284" height="2604" alt="image" src="https://github.com/user-attachments/assets/83aad7f1-f1c6-4d53-a2d1-726438d606d6" />

---

# Implementation

## API
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | api/locations?q=| Provides all locations that has matching substring as query in either location name or room number |
| POST | api/path/find| Attached starting location and destination to request body to retrive ordered list of nodesId representing path to take |

## pathfinding

How our team approached pathfinding relies heavily on floorplans of the buildings and its levels. We followed the following steps.
1. For a given floorplan, we will divide them up into grids, arbitrarily we chose 50 by 60.
2. We will markout each classroom / lecture hall etc. as Locations.
3. For each Location, it is guaranteed for there to be doors (can be multiple) We shall marked the grid at where the doors are generally at. Multiple location can share the same door if they are close. Each Location is associated with its corresponding doors.
4. Doors serves as nodes in our graph. Additionally, there is another type of node called junctions which are doors that are not connected to a location.
5. Each nodes has certain attributes like "sheltered", "walk", "lift", "stairs" etc base on the physical conditions of that node. This attributes allow us to modify our search algorithm for certain optimisation.

Example of how we built our data
<img width="1001" height="587" alt="image" src="https://github.com/user-attachments/assets/9ffcc026-bd40-4da8-bf9e-01a92983c08f" />
We cannot guarantee absolute accuracy which is dependent on the precision of floorplans, but it provides a good enough direction of where the classes are at.

Our team decided to challenge ourselves by using A* pathfinding algorithm as a learning opportunity. We wrote our own A* to fufil the following needs.
1.  A locations can have multiple doors. Search needs to start from multiple source as well as end at any of the doors of destination.
2.  It should be able to adapt to different type of optmisation instead of rewriting 3 different A*.
We thus decided to write a general A* which takes in comparators functions to produce different results. This means we only write A* once. We will write smaller comparator functions to fufil needs of different optimisation type.
---
# Software Engineering Practices

Below are the software engineering practices that we followed:     
| Naming Practices | We followed the Camelcase convention to name our variables. |
| :---- | :---- |
| File Structuring | We structured our files into different folders according to the functionality they belong in so it is easier to find each class. |
| Code Style | Eslint handles code styling for us. |
| Code Quality | We review each other's code during Pull Requests and cleanup our code which includes <ul> <li> Adding comments </li> <li> fixing violation of filestructuring </li> <li> Rewriting messy code </li> <li> Creating reusable components </li> </ul> |
| Team review | We keep each other updated with the development <ul> <li> Informing each other the feature we are working on </li> <li> The branch we working on </li> <li> Our completion status </li> <li> Difficulties we face so we can work on them together </li> <li> Discussion on implementation details before execution </li> <li> Discussion on development timeline </li> </ul>|
## Version Control
We are utilising git and github (no clue why we need to write this) as version control for our collaborative work.  
When new code is completed. Github Pull requests will be created to merge in dev or main.  
Below is a diagram on our version control workflow as well as our set of branching convention.  
<img width="3204" height="1424" alt="image" src="https://github.com/user-attachments/assets/e08b84c3-d17e-48b6-bb39-d8283b3e4f4a" />
| Branch | purpose |
| :---- | :---- |
| main  | Only hold Front-facing working version |
| dev | Staging new features and integrated testing |
| bugfixes/\_\_\_\_ | To fix bugs found in dev or other branches |
| feature/ \_\_\_\_ | To development new features |
| tool/ \_\_\_ | To create tools for developers |
| other | For things that are not a feature or bugfixes. Eg. pathfinding algo which standalone is not a feature |
## Software Testing
### Frontend  
Our primary testing for frontend uses React Testing Library  
To ensure correct behaviour of frontend, below are test criteria to ensure each component works as intended  
| Component | Expected | Test Outcome |
| :---- | :---- | :---- |
| Optimisation selection bar | <ul> <li> Renders 3 options </li> <li> At any instance only 1 is selected </li> </ul> | Passed |
| Location Search Bar | <ul> <li> Allow for text input </li> <li> Returns a flatList of locations that has matching substrings as text input </li> <li> Able to click on suggested list to autofill </li> <li> List should disappear when clicked </li> <ul>| Passed |
| Find Path button | <ul> <li> Able to send POST request to backend </li> <li> Able to receive response from backend </li> <li> Able to direct information to pathDisplay </li> </ul> | Passed |
| pathDisplay | <ul> <li> Receive an array of node\_id </li> <li> Able to render Map image base on input </li> <li> Able to accurately draw out the paths on Map image </li> <li> Provides Navigation direction </li> </ul> | Passed |

### Backend
We are using JEST for unit testing in our backend.  
To install, ensure Node js is installed
```bash
npm install jest
```
Unit test are written in {originalFileName}.test.js.  
To run Unit tests, open up package.json to modify the following.
```json
{
  "scripts": {
    "test": "jest"
  }
}
```
Then run:  
```bash
npm test
```
The following are our unit tests  
| Unit Test for | Expected | Test outcome |
| :---- | :---- | :---- |
| graphBuilder.js | Returns a Map object with each key being node\_id when database information is passed in | Passed |
| Astar.js | Returns an array of node\_id which is the shortest path. | Passed |
| Astar.js | Should be able to return “Unreachable” if no valid path | Passed |
---

# Development Timeline
| Date | Objective |  
| --- | --- |  
| May 1 - 10 | <ul> <li>Setting up environment</li> <li> template code for MERN stack </li> </ul> |  
| May 11 - 19 | <ul> <li> Vercel Hosting + Location Searching API </li> <li> frontend UI for location search </li> </ul> |
| May 20 - 31 | <ul> <li> Astar Algorithm </li> <li> Pathfinding capabilities in front end </li> </ul> |
| June 1 - 7 | <ul> <li> Map data gathering tool </li> <li> Increasing Map data  </li> <li> Testing on mobile devices </li> <ul> |
| June 8 - 14 | <ul> <li> Sheltered and accessible optimisation </li> <li> Upgrading path displaying </li> <ul>|
| June 15 - 21 | <ul> <li> Frontend History tab UI </li> </ul> |
| June 22 -  28 | <ul> <li> Local Storage of History on device </li> <ul> |
| June 29 -  July 5 | TBD |
| July 6 - 12 | TBD |
| July 13 - 19 | TBD |
| July 20 - 26 | TBD |
---

## Installation
Open up your terminal. Ensure git is installed run and run the following commands
```bash
git clone https://github.com/qqnoodle/CampusPath
```
To run the app normally after installation
```bash
cd CampusPath/app
npx expo start
```
click on the link where it says: Web is waiting on http://localhost:

