
const floorLevelMapping = (floor) => {
    if (floor.charAt(0) === 'B') {
        return 1 - parseInt(floor.substring(1));
    } else {
        return parseInt(floor);
    }
};

export class Location {
    cell;
    name;
    roomNumber;
    building;
    floor;
    doors = [];

    Location(cell, name, roomNumber, building, floor) {
        this.cell = cell;
        this.name = name;
        this.roomNumber = roomNumber;
        this.building = building;
        this.floor = floorLevelMapping(floor);
    }

    toJson() {
        return {"name": this.name, "roomNumber": this.roomNumber, "building": this.building, "floor": this.floor, "doors": this.doors}
    }
}