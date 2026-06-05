export function deleteNode(linkLogic, cellToNode, panel, cell) {
    if (!cellToNode.has(cell)) {
        return;
    }

    const node = cellToNode.get(cell);
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const cellKey = `${row}-${col}`;

    // Remove neighbour references from other nodes
    for (const [otherCell, otherNode] of cellToNode) {
        //cleans up Nodes
        if (otherNode.neighbour) {
            otherNode.neighbour = otherNode.neighbour.filter(n => n.node !== node.nodeId);
        }
        //Cleans up Location
        if (otherNode.doors) {
            otherNode.doors = otherNode.doors.filter(id => id !== node.nodeId);
        }
    }

    // Remove SVG lines connected to this cell
    const svg = panel.querySelector(".svgOverlay");
    for (const line of Array.from(svg.querySelectorAll("line"))) {
        if (line.dataset.cell1 === cellKey || line.dataset.cell2 === cellKey) {
            line.remove();
        }
    }

    // Remove from linksFormed
    linkLogic.linksFormed = linkLogic.linksFormed.filter(
        ([c1, c2]) => c1 !== cell && c2 !== cell
    );

    // Remove Css style so it becomes invisible
    cell.classList.remove("location", "junction", "door");

    // Remove from map
    cellToNode.delete(cell);
}