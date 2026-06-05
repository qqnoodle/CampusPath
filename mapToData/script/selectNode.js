import { Node } from "./Node.js";
import { Location } from "./Location.js"

export function selectNode(cellToNode, nodeInfoContainer, cell) {
    if (!cellToNode.has(cell)) {
        return;
    }
    nodeInfoContainer.innerHTML = "";
    let data = cellToNode.get(cell).toJson();
    Object.entries(data).forEach( ([key, value]) => {
        const pre = document.createElement("pre");
        pre.textContent = `${key}: ${JSON.stringify(value)}`;
        nodeInfoContainer.appendChild(pre);
    });
}