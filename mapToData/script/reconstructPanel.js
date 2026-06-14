import { buildNode } from "./buildNode.js";

export function reconstructPanel(linkLogic, cellToNode, panel, nodesData) {
    //To break this down
    //1. Run through and create every node
    //2. Creates the links, ignore links that dont exist;
    //3. Overwrite neighbour because not all neighbours can be drawn.
    

    //build cellToNode
    for (const node of nodesData) {
        //Retrieve the node_id to calculate the cell position
        const nodeId= node.node_id;
        const metaData = nodeId.split("-");
        const type = metaData[2];
        const row = metaData[3];
        const col = metaData[4];
        const cells = Array.from(panel.querySelectorAll(".gridCell"));
        const cell = cells.filter((c) => c.dataset.row === String(row) && c.dataset.col === String(col))[0];
        console.log(cell);
        buildNode(cellToNode, panel, cell, type, node.attribute);
        if (type == "J") {
            cell.classList.toggle("junction");
        } else {
            cell.classList.toggle("door")
        }
    }

    //build the links 
    for (const node of nodesData) {
        //Retrieve the node_id to calculate the cell position
        const nodeId= node.node_id;
        const metaData = nodeId.split("-");
        const type = metaData[2];
        const row = metaData[3];
        const col = metaData[4];
        const cells = Array.from(panel.querySelectorAll(".gridCell"));
        const cell = cells.filter((c) => c.dataset.row === String(row) && c.dataset.col === String(col))[0];
        for (const n of node.neighbour) {
            const neighbour = n.node;
            const nmetaData = neighbour.split("-");
            const nrow = nmetaData[3];
            const ncol = nmetaData[4];
            if (nmetaData[0] != metaData[0] || metaData[1] != metaData[1]) {
                continue;
            }
            const ncell = cells.filter((c) => c.dataset.row === String(nrow) && c.dataset.col === String(ncol))[0];
            linkLogic.pushLink(cell);
            linkLogic.pushLink(ncell);
        }
    }

    //Force replace neighbour
    for (const node of nodesData) {
        //Retrieve the node_id to calculate the cell position
        const nodeId= node.node_id;
        const metaData = nodeId.split("-");
        const row = metaData[3];
        const col = metaData[4];
        const cells = Array.from(panel.querySelectorAll(".gridCell"));
        const cell = cells.filter((c) => c.dataset.row === String(row) && c.dataset.col === String(col))[0];
        cellToNode[cell].neighbour = node.neighbour;
    }
}