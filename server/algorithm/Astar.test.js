const { graphBuilder } = require("./graphBuilder.js");
const { Astar } = require("./Astar.js");


const test1 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [{ "node": "COM1-1-D-0-2", "weight": 1 }] },
    { "node_id": "COM1-1-D-0-2", "neighbour": [] },
]);

test("A* Optimisation Fastest Straight line", () => {
    expect(Astar(
        test1,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-2"],
        (g, h) => g + h,
        () => 0,
        (_, g, neighbourData) => g + neighbourData.weight,
        Infinity,
        0,
        (a, b) => a < b,
        (a, b) => a < b,
        arr => Math.min(...arr)))
        .toEqual([
            "COM1-1-D-0-0",
            "COM1-1-D-0-1",
            "COM1-1-D-0-2",
        ]);
})


const test2 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [] },
]);

test("A* No paths", () => {
    expect(Astar(
        test2,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-2"],
        (g, h) => g + h,
        () => 0,
        (_, g, neighbourData) => g + neighbourData.weight,
        Infinity,
        0,
        (a, b) => a < b,
        (a, b) => a < b,
        arr => Math.min(...arr)))
        .toEqual([
            "Unreachable"
        ]);
})

const test3 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }, { "node": "COM1-1-D-0-2", "weight": 3 }] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }] },
    { "node_id": "COM1-1-D-0-2", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }] },
    { "node_id": "COM1-1-D-0-3", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }] },
]);

test("A* Optimisation Shortest Path", () => {
    expect(Astar(
        test3,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-3"],
        (g, h) => g + h,
        () => 0,
        (_, g, neighbourData) => g + neighbourData.weight,
        Infinity,
        0,
        (a, b) => a < b,
        (a, b) => a < b,
        arr => Math.min(...arr)))
        .toEqual([
            "COM1-1-D-0-0",
            "COM1-1-D-0-1",
            "COM1-1-D-0-3"
        ]);
})


const test4 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }, { "node": "COM1-1-D-0-2", "weight": 10 }], "attribute": ["walk", "sheltered"] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk"] },
    { "node_id": "COM1-1-D-0-2", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk", "sheltered"] },
    { "node_id": "COM1-1-D-0-3", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }], "attribute": ["walk"] },
]);
test("A* Optimisation Sheltered Path", () => {
    expect(Astar(
        test4,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-3"],
        (g, h) => [g[0], g[1] + h],
        () => 0,
        (graph, g, neighbourData) => [g[0] + (graph.get(neighbourData.node).attribute.filter((a) => a === "sheltered").length > 0 ? 0 : 1), g[1] + neighbourData.weight],
        [Infinity, -1],
        [0, 0],
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        arr => Math.min(...arr)))
        .toEqual([
            "COM1-1-D-0-0",
            "COM1-1-D-0-2",
            "COM1-1-D-0-3"
        ]);
})

const test5 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }, { "node": "COM1-1-D-0-2", "weight": 10 }], "attribute": ["walk", "sheltered"] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk"] },
    { "node_id": "COM1-1-D-0-2", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk"] },
    { "node_id": "COM1-1-D-0-3", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }], "attribute": ["walk"] },
]);
test("A* Optimisation no Sheltered Path, but fastest", () => {
    expect(Astar(
        test5,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-3"],
        (g, h) => [g[0], g[1] + h],
        () => 0,
        (graph, g, neighbourData) => [g[0] + (graph.get(neighbourData.node).attribute.filter((a) => a === "sheltered").length > 0 ? 0 : 1), g[1] + neighbourData.weight],
        [Infinity, -1],
        [0, 0],
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        arr => Math.min(...arr)))
        .toEqual([
            "COM1-1-D-0-0",
            "COM1-1-D-0-1",
            "COM1-1-D-0-3"
        ]);
})

const test6 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }, { "node": "COM1-1-D-0-2", "weight": 10 }], "attribute": ["walk", "sheltered"] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk", "sheltered"] },
    { "node_id": "COM1-1-D-0-2", "neighbour": [{ "node": "COM1-1-D-0-4", "weight": 1 }], "attribute": ["walk"] },
    { "node_id": "COM1-1-D-0-3", "neighbour": [{ "node": "COM1-1-D-0-5", "weight": 1 }], "attribute": ["walk"] },
    { "node_id": "COM1-1-D-0-4", "neighbour": [{ "node": "COM1-1-D-0-6", "weight": 1 }], "attribute": ["walk", "sheltered"] },
    { "node_id": "COM1-1-D-0-5", "neighbour": [{ "node": "COM1-1-D-0-7", "weight": 1 }], "attribute": ["walk", "sheltered"] },
    { "node_id": "COM1-1-D-0-6", "neighbour": [{ "node": "COM1-1-D-0-7", "weight": 1 }], "attribute": ["walk"] },
    { "node_id": "COM1-1-D-0-7", "neighbour": [], "attribute": ["walk", "sheltered"] },
]);

test("A* Optimisation not fully Sheltered Path, but most sheltered", () => {
    expect(Astar(
        test6,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-7"],
        (g, h) => [g[0], g[1] + h],
        () => 0,
        (graph, g, neighbourData) => [g[0] + (graph.get(neighbourData.node).attribute.filter((a) => a === "sheltered").length > 0 ? 0 : 1), g[1] + neighbourData.weight],
        [Infinity, -1],
        [0, 0],
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        arr => Math.min(...arr)))
        .toEqual([
            "COM1-1-D-0-0",
            "COM1-1-D-0-1",
            "COM1-1-D-0-3",
            "COM1-1-D-0-5",
            "COM1-1-D-0-7"
        ]);
})

const test7 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }, { "node": "COM1-1-D-0-2", "weight": 10 }], "attribute": ["walk", "stairs"] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk", "stairs"] },
    { "node_id": "COM1-1-D-0-2", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk"] },
    { "node_id": "COM1-1-D-0-3", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }], "attribute": ["walk"] },
]);
test("A* Optimisation Accessible Path", () => {
    expect(Astar(
        test7,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-3"],
        (g, h) => [g[0], g[1] + h],
        () => 0,
        (graph, g, neighbourData) => [g[0] + (graph.get(neighbourData.node).attribute.filter((a) => a === "stairs").length > 0 ? Infinity : 0), g[1] + neighbourData.weight],
        [Infinity, -1],
        [0, 0],
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        arr => Math.min(...arr)))
        .toEqual([
            "COM1-1-D-0-0",
            "COM1-1-D-0-2",
            "COM1-1-D-0-3"
        ]);
})

const test8 = graphBuilder([
    { "node_id": "COM1-1-D-0-0", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }, { "node": "COM1-1-D-0-2", "weight": 10 }], "attribute": ["walk", "stairs"] },
    { "node_id": "COM1-1-D-0-1", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk", "stairs"] },
    { "node_id": "COM1-1-D-0-2", "neighbour": [{ "node": "COM1-1-D-0-3", "weight": 1 }], "attribute": ["walk", "stairs"] },
    { "node_id": "COM1-1-D-0-3", "neighbour": [{ "node": "COM1-1-D-0-1", "weight": 1 }], "attribute": ["walk"] },
]);
test("A* Optimisation Accessible Path, no lifts", () => {
    expect(Astar(
        test8,
        ["COM1-1-D-0-0"],
        ["COM1-1-D-0-3"],
        (g, h) => [g[0], g[1] + h],
        () => 0,
        (graph, g, neighbourData) => [g[0] + (graph.get(neighbourData.node).attribute.filter((a) => a === "stairs").length > 0 ? Infinity : 0), g[1] + neighbourData.weight],
        [Infinity, -1],
        [0, 0],
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        (a, b) => {
            if (a[0] != b[0]) return a[0] < b[0];
            return a[1] < b[1];
        },
        arr => Math.min(...arr)))
        .toEqual([
            "Unreachable"
        ]);
})