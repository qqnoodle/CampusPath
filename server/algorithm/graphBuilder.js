const Nodes = require("../models/nodes.model.js");

async function graphBuilder(db) {
    const data = await db.find().lean();
    const graph = new Map();
    data.forEach(node => {
        graph.set(node.node_id, node);
    });
    return graph;
}

module.exports = { graphBuilder };
