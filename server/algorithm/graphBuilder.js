/**
 * Given list Nodes from database, build a graph
 * 
 * @param {[nodes]} data - An array of nodes
 * @returns {Map object} Return a graph
 * 
 * @example
 */
function graphBuilder(data) {
    const graph = new Map();
    data.forEach(node => {
        graph.set(node.node_id, node);
    });
    return graph;
}

module.exports = { graphBuilder };
