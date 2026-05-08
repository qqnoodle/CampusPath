const Nodes = reqire("../models/nodes.model.js");

async function graphBuilder(db) {
    data = await db.find().lean();
    graph = new Map();
    data.forEach(node => {
        graph[node.node_id] = node;
    });
    return graph;
}
module.export(graphBuilder)
