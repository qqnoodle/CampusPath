import { createPanel } from "./mapPanel.js";
import { LinkLogic } from "./linkLogic.js";

//Global variables
const cellToNode = new Map();
const linkLogic = new LinkLogic(cellToNode);

//DOM elements
const toolBar = document.querySelector(".toolBar");
const mapPanelContainer = document.querySelector(".mapPanelContainer");
const nodeInfoContainer = document.querySelector(".nodeInfoContainer");
const jsonOutputContainer = document.querySelector(".jsonOutputContainer");
console.log("Successfully loaded the script");


createPanel(linkLogic, cellToNode, toolBar, mapPanelContainer, nodeInfoContainer, jsonOutputContainer);
createPanel(linkLogic, cellToNode, toolBar, mapPanelContainer, nodeInfoContainer, jsonOutputContainer);
console.log("mapPanel loaded successfully");

