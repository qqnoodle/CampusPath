export function svgDraw(cell1, cell2) {
    const panel = cell1.parentElement.parentElement;
    const svg = panel.querySelector(".svgOverlay");
    const svgRect = svg.getBoundingClientRect();
    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );
    const r1 = cell1.getBoundingClientRect();
    const r2 = cell2.getBoundingClientRect();
    const scale = parseFloat(panel.dataset.scale);

    //Gonna have to recalibrate to center so it doesnt draw from topleft corner
    const x1 = (r1.left + r1.width / 2 - svgRect.left) / scale ;
    const x2 = (r2.left + r2.width / 2 - svgRect.left) / scale ;
    const y1 = (r1.top + r1.height / 2 - svgRect.top) / scale ;
    const y2 = (r2.top + r2.height / 2 - svgRect.top) / scale ;

    line.setAttribute("x1", x1);
    line.setAttribute("x2", x2);
    line.setAttribute("y1", y1);
    line.setAttribute("y2", y2);
    //I like red
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", "3");
    svg.appendChild(line);
    
    //need this data so i can delete them
    line.dataset.cell1 = `${cell1.dataset.row}-${cell1.dataset.col}`;
    line.dataset.cell2 = `${cell2.dataset.row}-${cell2.dataset.col}`;
    return line;
}