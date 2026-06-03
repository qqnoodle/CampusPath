import { cellClick } from "./cellHandler.js";

function initMapPanel(cellToNode, panel, toolBar, nodeInfoContainer, jsonOutputContainer) {
    const input = panel.querySelector(".imageInput");
    const img = panel.querySelector(".mapImage");
    const closeBtn = panel.querySelector(".closeBtn");
    const grid = panel.querySelector(".gridOverlay");
    const wrapper = panel.querySelector(".imageWrapper");
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
                const cell = document.createElement("div");
                cell.classList.add("gridCell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener("click", (e) => {
                    cellClick(cellToNode, e.currentTarget, panel, nodeInfoContainer);
                    e.stopPropagation();
                });
                grid.appendChild(cell);
            }
        }
    });

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        imageLoaded = false;
        imagePending = false;
        img.src = "";
        input.value = "";
        grid.innerHTML = "";
    });

    initZoom(panel, grid, wrapper);
}

function initZoom(panel, grid, wrapper) {
    let scale = 1;
    const minScale = 0.5;
    const maxScale = 5;
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
    });
}

export function createPanel(cellToNode, toolBar, container, nodeInfoContainer, jsonOutputContainer) {
    const panel = document.createElement("div");
    panel.classList.add("mapPanel");
    panel.innerHTML = `
        <div class="imageWrapper">
            <img class="mapImage">
        </div>
        <div class="gridOverlay"></div>
        <input type="file" class="imageInput" accept="image/*" hidden>
        <button class="closeBtn">Close Map</button>
    `;
    container.appendChild(panel);
    initMapPanel(cellToNode, panel, toolBar, nodeInfoContainer, jsonOutputContainer);
}