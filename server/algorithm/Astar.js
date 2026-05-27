const { MinPriorityQueue } = require('@datastructures-js/priority-queue');
/**
 * A* algo to find the shortest path
 * 
 * @param {Map object} graph - A graph of all nodes
 * @param {[String]} src - An array of String which are node_id which are starting points
 * @param {[String]} dst - An array of String which are node_id which are destination points
 * @param {Function(g, h) -> type F} F - A function that takes in g and h and computes a value
 * @param {Function(graph, n1, n2) -> type H} H - A function that takes in graph and 2 nodes and return a heuristic value for the 2 nodes.
 * @param {Function(graph, g, neighbourData) -> type g} G - A function that takes in a graph, g and neighbourData a pair {node: .., weight: ..} of String and number. String is node id and weight is number.
 * @param {g} Gdefault - A default value of type g used for cost of src nodes.
 * @param {Function(F1, F2) -> boolean} Fcomparator - A function that returns F1 < F2
 * @param {Function(G1, G2) -> boolean} Gcomparator - A function that return G1 < G2
 * @param {Function([h]) -> type h} minHeuristic - A function that return min H from a list of H
 *
 * @returns {[String]} - An array of String which are ordered list of node_id of the shortest path
 * 
 */

function Astar(graph, src, dst, F, H, G, Gdefault, Fcomparator, Gcomparator, minHeuristic) {

    let openList = new MinPriorityQueue(Fcomparator);
    let closeList = new Map();

    //the real cost of travelling to a node from source
    let Gscore = new Map();

    //to assist in path reconstruction
    let parentPointer = new Map();

    //Update gscore of all source nodes to default
    //Update parent which is themselves
    //Update the minHeap which is openList
    src.map((sourceNode) => {
        parentPointer.set(sourceNode, sourceNode);
        Gscore.set(sourceNode, Gdefault);
        openList.enqueue({ curNode: sourceNode, cost: minHeuristic(dst.map((destinationNode) => H(graph, sourceNode, destinationNode))) });
    });

    //Convert an Array of all destination node to a set for O(1) look up
    const destinations = new Set(dst);

    let endNode = null;
    //Set up openList essentially the min Heap with all the source
    while (!openList.isEmpty()) {
        let element = openList.dequeue();
        let curNode = element.curNode;
        let cost = element.cost;

        console.log(element);
        console.log(graph.get(curNode));

        //lazy deletion
        let curF = F(Gscore.get(curNode), minHeuristic(dst.map((destinationNode) => H(graph, curNode, destinationNode))));
        if (Fcomparator(curF, cost)) continue;
        if (destinations.has(curNode)) {
            endNode = curNode;
            break;
        }
        if (closeList.has(curNode)) continue;
        closeList.set(curNode, cost);

        //go over the neighbours
        let g = Gscore.get(curNode);
        graph.get(curNode).neighbour.forEach(neighbourData => {
            let child = neighbourData.node;
            if (closeList.has(child)) return;

            //very similar to dijkstra with small modification of this heuristic
            let gEstimate = G(graph, g, neighbourData);
            if (!Gscore.has(child) || Gcomparator(gEstimate, Gscore.get(child))) {
                Gscore.set(child, gEstimate);
                parentPointer.set(child, curNode);

                let h = minHeuristic(dst.map((destinationNode) => H(graph, child, destinationNode)));
                let f = F(gEstimate, h);
                openList.enqueue({ curNode: child, cost: f });
            }
        });
    }

    //Safeguard for when place is unreachable
    if (endNode === null) {
        return ["Unreachable"];
    }

    //path reconstruction
    let path = [];
    let node = endNode;
    while (parentPointer.get(node) != node) {
        path.push(node);
        node = parentPointer.get(node);
    }
    path.push(node);
    return path.reverse();
};

module.exports = { Astar };
