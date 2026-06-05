import { Node } from "./Node.js";
import { Location } from "./Location.js";
import { svgDraw } from "./svgDraw.js";

function calculateWeight(cell1, cell2) {
    const r1 = parseInt(cell1.dataset.row, 10);
    const c1 = parseInt(cell1.dataset.col, 10);
    const r2 = parseInt(cell2.dataset.row, 10);
    const c2 = parseInt(cell2.dataset.col, 10);
    return Math.floor(Math.hypot(r1-r2, c1-c2));
}

export class LinkLogic {

    pendingLink = [];

    //TODO This is too much work to kill off links I need core functionality anyways
    pendingUnlink = [];
    

    //Gotta use this scuff way because I dont wish to create hashing function to hash a pair
    linksFormed = [];

    constructor(cellToNode) {
        this.cellToNode = cellToNode;
    }
    
    createLink() {
        const cell1 = this.pendingLink[0];
        const cell2 = this.pendingLink[1];
        let n1 = this.cellToNode.get(cell1);
        let n2 = this.cellToNode.get(cell2);

        //NO REASON TO LINK 2 locations
        if (n1 instanceof Location && n2 instanceof Location) {
            alert("WHY ARE YOU LINKING 2 LOCATIONS");
            this.pendingLink = [];
            return;
        }
        //Essentially i am checking whether they are from the same Panel to handle links differently
        if (cell1.parentElement === cell2.parentElement) {
            //None are locations
            if (n1.constructor === n2.constructor) {
                const weight = calculateWeight(cell1, cell2);
                const neighbour1 = {"node" : n2.nodeId, "weight": weight};
                const neighbour2 = {"node" : n1.nodeId, "weight": weight};
                n1.neighbour.push(neighbour1);
                n2.neighbour.push(neighbour2);

            } else {
                //One of them is defo a location
                if (!(n1 instanceof Location)) {
                    let temp = n1;
                    n1 = n2;
                    n2 = temp;
                }
                n1.doors.push(n2.nodeId);
            }
            this.pendingLink.sort();
            this.linksFormed.push(this.pendingLink);
            svgDraw(cell1, cell2);

        } else {
            //HOW SHOULD I HANDLE CROSS plane. I only allow nodes to nodes i guess
            //I cant really visually show the link cause thats too weird to be drawing lines across
            if (n1.constructor === n2.constructor) {
                let weight = prompt("Please give reasonable INTEGER for weight");
                weight = parseInt(weight, 10);
                const neighbour1 = {"node" : n2.nodeId, "weight": weight};
                const neighbour2 = {"node" : n1.nodeId, "weight": weight};
                n1.neighbour.push(neighbour1);
                n2.neighbour.push(neighbour2);
                this.pendingLink.sort();
                this.linksFormed.push(this.pendingLink);
            } else {
                alert("You probably tried to link locations to node across, DENIED, link flushed");
            }
        }
        //flush
        this.pendingLink = [];
        return;
    }

    pushLink(cell) {
        this.pendingLink.push(cell);
        if (this.pendingLink.length === 2) {
            //deny self
            if (this.pendingLink[0] === this.pendingLink[1]) {
                this.pendingLink = [];
                return;
            }
            //deny repeated edges
            let filterLinks = this.linksFormed.filter(
                (elem)=> {
                    return (elem[0] === this.pendingLink[0] && elem[1] === this.pendingLink[1]) || (elem[0] === this.pendingLink[1] && elem[1] === this.pendingLink[0]);
                });

            if (filterLinks.length > 0) {
                this.pendingLink = [];
                return;
            }
            this.createLink();
        }
    }
}