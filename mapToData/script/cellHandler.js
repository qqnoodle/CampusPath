import { selectNode } from "./selectNode.js";
import { deleteNode } from "./deleteNode.js";
import { buildNode } from "./buildNode.js";
import { linkNode } from "./linkNode.js";

export function cellClick(cellToNode, cell, panel, nodeInfoContainer) { 
    const toolBar = document.querySelector(".toolBar");
    const action = toolBar.querySelector('input[name="actionSelector"]:checked').value;
    const attribute = Array.from(toolBar.querySelectorAll('input[name="attributeSelector"]:checked')).map(box => box.value);
    switch (action) {
        case "Select":
            selectNode(cellToNode, nodeInfoContainer, cell);
            break;
        case "Delete":
            deleteNode(cellToNode, panel, cell);
            break;
        case "Location":
            if (!cellToNode.has(cell)) {
                buildNode(cellToNode, panel, cell, "L", attribute);
                cell.classList.toggle("location");
            }
            break;
        case "Junction":
            if (!cellToNode.has(cell)) {
                buildNode(cellToNode, panel, cell, "J", attribute);
                cell.classList.toggle("junction");
            }
            break;
        case "Door":
            if (!cellToNode.has(cell)) {
                buildNode(cellToNode, panel, cell, "D", attribute);
                cell.classList.toggle("door");
            }
            break;
        case "Link":
            break;
        default:
            return;
    }
    return;
}