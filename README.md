# CampusPath

A pathfinding application designed for the National University of Singapore (NUS) campus, helping users navigate from one location to another with optimized routes.

---

## Overview
CampusPath provides navigation between campus locations such as lecture halls, classrooms, and facilities. Unlike traditional GPS systems, it is designed to handle indoor and campus-specific navigation, where standard tools often fail.

---

## Problem Statement
Current GPS-based navigation systems:
- Struggle with indoor navigation
- Do not account for campus-specific pathways
- Cannot optimize for preferences like shelter or accessibility

---

## Solution
CampusPath addresses these limitations by:
- Allowing users to input a starting location and destination
- Computing the most optimal route based on selected conditions:
  - Shortest distance
  - Sheltered paths (for rain)
  - Accessibility (wheelchair-friendly routes)
- Supporting indoor and outdoor navigation

---

## Features
- Location-to-location pathfinding  
- Sheltered route option  
- Accessibility-friendly routing 
- Campus-specific mapping (NUS)
- Map display of path (To be confirmed)

---

## How It Works
The application uses graph-based pathfinding algorithms (e.g., Dijkstra or A*) where:
- Nodes represent locations (buildings, rooms, junctions)
- Edges represent walkable paths
- Weights are adjusted based on user preferences (distance, shelter, accessibility)

---

## Installation
To be determined
