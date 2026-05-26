const express = require("express");
const Location = require("../models/locations.model.js");
const Nodes = require("../models/nodes.model.js");
const { graphBuilder } = require("../algorithm/graphBuilder.js");
const { Astar } = require("../algorithm/Astar.js");

const findPath = async (req, res) => {
    const optimisationMap = {
        0: "Shortest",
        1: "Sheltered",
        2: "Accessible"
    };
    try {
        const { startLocation, endLocation, optimisation } = req.body;

        //TODO Convert information into graphs

        const start = await Location.findOne({ roomNumber: startLocation });
        const end = await Location.findOne({ roomNumber: endLocation });
        // Pick the first door node as src/dst(temp)
        const srcNodeId = start.doors[0].node_id;
        const dstNodeId = end.doors[0].node_id;

        //TODO Run the algorithm

        const graph = await graphBuilder(Nodes);

        const H = (graph, n1, n2) => 0; // no heuristic => pure Dijkstra

        const F = (g, h) => g + h;

        const G = (graph, g, child) => {
            const parentNode = graph.get(child);
            // sum up edge weights
            return g + (parentNode?.weight ?? 1);
        };

        const Gdefault = 0;
        const Gcomparator = (a, b) => a < b;  // lower g is better
        const Fcomparator = (a, b) => a < b;  // for MinPriorityQueue

        const optimisationLabel = optimisationMap[optimisation];

        const path = Astar(graph, srcNodeId, dstNodeId, F, H, G, Gdefault, Fcomparator, Gcomparator);
        //TODO Configure the output to fit the needs of frontend
        const enrichedPath = path.map(nodeId => {
            const node = graph.get(nodeId);
            return {
                node_id: nodeId,
                building: node.building,
                floor: node.floor,
                attributes: node.attribute,
            };
        });

        res.status(200).json({
            success: true,
            optimisation: optimisationLabel,
            path: enrichedPath,
            totalNodes: enrichedPath.length,
        });

        //TODO Handle the history
    } catch (error) {
        res.header("Access-Control-Allow-Origin", "*");
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { findPath };
