
const floorLevelMapping = (floor) => {
    if (floor.charAt(0) === 'B') {
        return 1 - parseInt(floor.substring(1));
    } else {
        return parseInt(floor);
    }
};

export class Node { 

    cell;
    nodeId;
    building;
    neighbour = [];
    floor;
    attribute;
    nodeType;

    constructor (cell, nodeId, building, floor, attribute, type) {
        this.cell = cell;
        this.building = building;
        this.floor = floorLevelMapping(floor);
        this.nodeId = nodeId;
        this.attribute = attribute;
        this.nodeType = type === "D" ? "door" : "junction";
    }
    
    toJson() {
        return {"node_id": this.nodeId, "building": this.building, "floor": this.floor, "neighbour": this.neighbour, "attribute": this.attribute, "nodeType": this.nodeType};
    }
}