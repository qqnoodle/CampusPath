import { Node } from "./Node.js";
import { Location } from "./Location.js"
const floorLevelMapping = (floor) => {
    if (floor.charAt(0) === 'B') {
        return 1 - parseInt(floor.substring(1));
    } else {
        return parseInt(floor);
    }
}

export function buildNode(cellToNode, panel, cell, type, attribute) {
    let node = null;
    if (type === "L") {
        let name = prompt("Location name");
        let roomNumber = prompt("roomNumber");
        if (!name || !roomNumber) {
            alert("Please fill in all information!!");
            return;
        }
        node = new Location(
            cell,
            name,
            roomNumber,
            panel.dataset.building,
            panel.dataset.floor
        );
    } else {
        const nodeId = `${panel.dataset.building}-${panel.dataset.floor}-${type}-${cell.dataset.row}-${cell.dataset.col}`;
        node = new Node(
            cell,
            nodeId,
            panel.dataset.building,
            panel.dataset.floor,
            attribute,
            type);
    }
    if (!cellToNode.has(cell)) {
        cellToNode.set(cell, node);
    }
    return;
}
