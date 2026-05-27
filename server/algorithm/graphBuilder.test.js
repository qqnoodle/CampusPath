const { graphBuilder } = require("./graphBuilder");


const testData1 = [
    { "node_id": "COM1-1-D-7-7", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-J-7-5", "weight": 2 }, { "node": "COM1-1-D-7-10", "weight": 3 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" },
    { "node_id": "COM1-1-D-7-10", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-7", "weight": 2 }, { "node": "COM1-1-D-7-12", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" },
    { "node_id": "COM1-1-D-7-12", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-10", "weight": 2 }, { "node": "COM1-1-D-7-14", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }
];

test("graphBuilding testcase 1", () => {
    expect(graphBuilder(testData1)).toEqual(new Map([
        ["COM1-1-D-7-7", { "node_id": "COM1-1-D-7-7", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-J-7-5", "weight": 2 }, { "node": "COM1-1-D-7-10", "weight": 3 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }],
        ["COM1-1-D-7-10", { "node_id": "COM1-1-D-7-10", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-7", "weight": 2 }, { "node": "COM1-1-D-7-12", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }],
        ["COM1-1-D-7-12", { "node_id": "COM1-1-D-7-12", "building": "COM1", "floor": 1, "neighbour": [{ "node": "COM1-1-D-7-10", "weight": 2 }, { "node": "COM1-1-D-7-14", "weight": 2 }], "nodeType": "door", "attribute": ["walk", "sheltered"], "clusterGroup": "cluster" }]
    ]));
});
