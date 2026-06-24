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
    const optimisationFunctions = {
        0: {
            F: (g, h) => g + h,
            H: (graph, n1, n2) => 0,
            G: (graph, g, neighbourData) => g + neighbourData.weight,
            FLimit: Infinity,
            Gdefault: 0,
            Fcomparator: (f1, f2) => f1 < f2,
            Gcomparator: (g1, g2) => g1 < g2,
            minHeuristic: (lst) => Math.min(...lst)
        },
        1: {
            F: (g, h) => [g[0], g[1] + h],
            H: (graph, n1, n2) => 0,
            G: (graph, g, neighbourData) => [g[0] + (graph.get(neighbourData.node).attribute.filter((a) => a === "Sheltered").length > 0 ? 0 : 1), g[1] + neighbourData.weight],
            FLimit: [Infinity, -1],
            Gdefault: [0, 0],
            Fcomparator: (f1, f2) => f1[0] != f2[0] ? f1[0] < f2[0] : f1[1] < f2[1],
            Gcomparator: (g1, g2) => g1[0] != g2[0] ? g1[0] < g2[0] : g1[1] < g2[1],
            minHeuristic: (lst) => Math.min(...lst)
        },
        2: {
            //TODO modify for optimisation by accessibility
            F: (g, h) => [g[0], g[1] + h],
            H: (graph, n1, n2) => 0,
            G: (graph, g, neighbourData) => [g[0] + (graph.get(neighbourData.node).attribute.filter((a) => a === "Stair").length > 0 ? Infinity : 0), g[1] + neighbourData.weight],
            FLimit: [Infinity, -1],
            Gdefault: [0, 0],
            Fcomparator: (f1, f2) => f1[0] != f2[0] ? f1[0] < f2[0] : f1[1] < f2[1],
            Gcomparator: (g1, g2) => g1[0] != g2[0] ? g1[0] < g2[0] : g1[1] < g2[1],
            minHeuristic: (lst) => Math.min(...lst)
        },
    }
    try {
        const { startLocation, endLocation, optimisation } = req.body;

        //TODO Convert information into graphs
        //Extract out the location information from database
        const optimisationLabel = optimisationMap[optimisation];
        const optFunc = optimisationFunctions[optimisation];

        const start = await Location.findOne({
            roomNumber: startLocation.roomNumber,
            building: startLocation.building,
            floor: startLocation.floor
        });
        const end = await Location.findOne({
            roomNumber: endLocation.roomNumber,
            building: endLocation.building,
            floor: endLocation.floor
        });

        //
        const src = start.doors;
        const dst = end.doors;

        //TODO Run the algorithm
        const nodeList = await Nodes.find();
        const graph = graphBuilder(nodeList);
        const path = Astar(graph, src, dst, optFunc.F, optFunc.H, optFunc.G, optFunc.FLimit, optFunc.Gdefault, optFunc.Fcomparator, optFunc.Gcomparator, optFunc.minHeuristic);

        //Prune off joint stairs/lift chaining
        const filteredPath = path.filter((nodeId, i) => {
            const filteredType = ["Stair", "Lift"];

            if (!graph.get(nodeId).attribute.some(attr => filteredType.includes(attr))) return true;

            let curAttr = "Stair";
            if (!graph.get(nodeId).attribute.includes(curAttr)) curAttr = "Lift";

            const sameAsPrev = graph.get(path[i - 1])?.attribute.includes(curAttr);
            const sameAsNext = graph.get(path[i + 1])?.attribute.includes(curAttr);

            return !sameAsPrev || !sameAsNext;
        });
        //replace all nodeId by actual nodes
        const nodesInPath = filteredPath.map((nodeId) => graph.get(nodeId));

        //segregate paths by Maps
        let segregatedPath = [[]];
        let mapIndex = 0;
        for (const node of nodesInPath) {
            let slottingArray = segregatedPath[mapIndex];

            if (slottingArray.length == 0) {
                slottingArray.push(node);
                continue;
            }

            const prev = slottingArray.at(-1);

            if (node.building == prev.building && node.floor == prev.floor) {
                slottingArray.push(node);
            } else {
                segregatedPath.push([node]);
                mapIndex += 1;
            }
        }


        res.status(200).json({
            success: true,
            optimisation: optimisationLabel,
            path: segregatedPath,
            totalNodes: path.length,
            src: src,
            dst: dst,
        });

        //TODO Handle the history
    } catch (error) {
        res.header("Access-Control-Allow-Origin", "*");
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { findPath };
