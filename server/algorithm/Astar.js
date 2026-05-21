import { MinPriorityQueue } from '@datastructures-js/priority-queue';


function Astar(graph, src, dst, F, H, G, Gdefault, Fcomparator, Gcomparator) {
    /*
     * graph is the node
     * graph = { node_id: info of node}
     *
     * src is the src node_id
     * dst is the dst node_id
     * F(g, h) computes F value given g and h
     * H(graph, n1, n2) computes the heuristic of n1 given n2
     * G(graph, g, nodeSchema n) computes the next G value given node information
     * comparator(F1, F2) where F is any form return F1 < F2
    */

    let openList = new MinPriorityQueue(Fcomparator);
    let closeList = new Map();
    let Gscore = new Map();
    let parentPointer = new Map();

    Gscore.set(src, Gdefault);
    parentPointer.set(src, src);

    openList.enqueue({ curNode: src, cost: H(graph, src, dst) });
    while (!openList.isEmpty()) {
        let { curNode, cost } = openList.dequeue();

        //lazy deletion
        let curF = F(G.score.get(curNode), H(graph, curNode, dst));
        if (Fcomparator(cost, curF)) continue;
        if (curNode == dst) break;
        if (closeList.has(curNode)) continue;

        closeList.set(curNode, cost);

        //go over the neighbours
        let g = Gscore.get(curNode);
        graph.get(curNode).neighbour.forEach(n => {
            let child = n.node_id;
            if (closeList.has(child)) return;

            //very similar to dijkstra with small modification of this heuristic
            let gEstimate = G(graph, g, child);
            if (!Gscore.has(child) || Gcomparator(gEstimate, Gscore.get(child))) {
                Gscore.set(child, gEstimate);
                parentPointer.set(child, curNode);

                let h = H(graph, child, dst);
                let f = F(gEstimate, h);
                openList.enqueue({ curNode: child, cost: f });
            }
        });
    }


    //path reconstruction
    let path = [];
    let node = dst;
    while (parentPointer.get(node) != node) {
        path.push(node);
        node = parentPointer.get(node);
    }
    path.push(src);
    return path.reverse();
};
