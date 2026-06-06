import { makeCell } from "./cell.js";
import { cellClick } from "./cellHandler.js";
import { Location } from "./Location.js";
import { Node } from "./Node.js";
import { reconstructPanel } from "./reconstructPanel.js";

function initMapPanel(linkLogic, cellToNode, panel, toolBar, nodeInfoContainer, jsonOutputContainer) {
    const input = panel.querySelector(".imageInput");
    const img = panel.querySelector(".mapImage");
    const closeBtn = panel.querySelector(".closeBtn");
    const importBtn = panel.querySelector(".importBtn");
    const exportBtn = panel.querySelector(".exportBtn");
    const grid = panel.querySelector(".gridOverlay");
    const wrapper = panel.querySelector(".imageWrapper");
    const svg = panel.querySelector(".svgOverlay");
    let imageLoaded = false;
    let imagePending = false;
    const rows = 50;
    const cols = 60;

    panel.addEventListener("click", () => {
        if (imageLoaded || imagePending) {
            return;
        }
        let building = prompt("Building Name");
        let floor = prompt("Floor level");
        if (!building || !floor) {
            alert("Please provide both information!!");
            return;
        }
        panel.dataset.building = building;
        panel.dataset.floor = floor;
        imagePending = true;
        input.click();
    });

    input.addEventListener("change", () => {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        imageLoaded = true;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = makeCell(r, c, linkLogic, cellToNode, panel, nodeInfoContainer);
                grid.appendChild(cell);
            }
        }
    });

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        for (const child of grid.children) {
            cellToNode.delete(child);
        }
        imageLoaded = false;
        imagePending = false;
        img.src = "";
        input.value = "";
        grid.innerHTML = "";
        svg.innerHTML = "";
    });

    importBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        //const locationsInput = prompt("Paste Locations JSON array:");
        const nodesInput = prompt("Paste Nodes JSON array:");
        
        if (!nodesInput) {
            alert("Info needed");
            return;
        }
        //const locationsData = JSON.parse(locationsInput);
        const nodesData = JSON.parse(nodesInput);

        reconstructPanel(linkLogic, cellToNode, panel, nodesData);
        
    });

    exportBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // BY right I should create a function in a different file but.....
        let allLocations = [];
        let allNodes = [];
        for (const [cell, node] of cellToNode) {
            let arr = allNodes;
            if (node instanceof Location) {
                arr = allLocations;
            }
            arr.push(node.toJson());
        }
        jsonOutputContainer.innerHTML = `
        <pre><strong>Locations</strong>\n${JSON.stringify(allLocations, null, 2)}</pre>
        <pre><strong>Nodes</strong>\n${JSON.stringify(allNodes, null, 2)}</pre>
    `;
    });


    initZoom(panel, grid, wrapper, svg);
}

function initZoom(panel, grid, wrapper, svg) {
    let scale = 1;
    const minScale = 0.5;
    const maxScale = 5;
    panel.dataset.scale = scale;
    panel.addEventListener("wheel", (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        if (e.deltaY < 0) {
            scale += zoomSpeed;
        } else {
            scale -= zoomSpeed;
        }
        scale = Math.min(maxScale, Math.max(minScale, scale));
        wrapper.style.transform = `scale(${scale})`;
        grid.style.transform = `scale(${scale})`;
        svg.style.transform = `scale(${scale})`;
        //This will let me access the scale for drawing
        panel.dataset.scale = scale;
    });
}

export function createPanel(linkLogic, cellToNode, toolBar, container, nodeInfoContainer, jsonOutputContainer) {
    const panel = document.createElement("div");
    panel.classList.add("mapPanel");
    panel.innerHTML = `
        <div class="imageWrapper">
            <img class="mapImage">
        </div>
        <div class="gridOverlay"></div>
        <svg class="svgOverlay"></svg>
        <input type="file" class="imageInput" accept="image/*" hidden>
        <button class="closeBtn">Close Map</button>
        <button class="importBtn"> import data </button>
        <button class="exportBtn"> export data </button>
    `;
    container.appendChild(panel);
    initMapPanel(linkLogic, cellToNode, panel, toolBar, nodeInfoContainer, jsonOutputContainer);
}
