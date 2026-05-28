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
- Visual Map UI for the paths (Extension feature)

---

# Techstack
### Frontend
We decided to build a mobile application similar to NUS NextBus for ease of access. Therefore, we decided to build our app with React Native an UI software framework that builds mobile applications for iOS and Android as our frontend to save us trouble for different platform deployment.  
### Database
For database we choose MongoDB which has developer-friendly JSON-like data structure, and ability to easily scale. This allow us to store map data which is essential for path computation.

### Backend
With both our frontend and database decided. We opt for Node Js express framework which will simplify and help with our API routing. Combined with Vercel serverless hosting of our backend, this sets up our locations searching API as well as path computation to be available without our own hardware.

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
