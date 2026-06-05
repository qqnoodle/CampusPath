import { cellClick } from "./cellHandler.js";

export function makeCell(row, col, linkLogic, cellToNode, panel, nodeInfoContainer) {
    const cell = document.createElement("div");
    cell.classList.add("gridCell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener("click", (e) => {
        cellClick(linkLogic, cellToNode, e.currentTarget, panel, nodeInfoContainer);
        e.stopPropagation();
    });
    return cell;
}