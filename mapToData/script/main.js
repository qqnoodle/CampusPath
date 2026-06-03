import { createPanel } from "./mapPanel.js";

//Global variables
let cellToNode = new Map();

//DOM elements
const toolBar = document.querySelector(".toolBar");
const mapPanelContainer = document.querySelector(".mapPanelContainer");
const nodeInfoContainer = document.querySelector(".nodeInfoContainer");
const jsonOutputContainer = document.querySelector(".jsonOutputContainer");
console.log("Successfully loaded the script");


createPanel(cellToNode, toolBar, mapPanelContainer, nodeInfoContainer, jsonOutputContainer);
createPanel(cellToNode, toolBar, mapPanelContainer, nodeInfoContainer, jsonOutputContainer);
console.log("mapPanel loaded successfully");

