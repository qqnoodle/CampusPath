type nodeNeighbour = {
    node: string,
    weight: number
}

export type Node = {
    _id: string,
    node_id: string,
    building: number,
    floor: number,
    neighbour: nodeNeighbour[],
    attribute: string[]
    nodeType: string
}
