const fs = require('fs');

// ========= CONFIG =========
const INPUT_FILE = './COM1_B1.txt'; /// SPECIFY WHICH FILE
const OUTPUT_FILE = './COM1_B1.json';

const BUILDING = "COM1"; /// WHAT BUILDING (STRING)
const LEVEL = "B1" /// WHAT NAME LEVEL (STRING)
const FLOOR = 0; /// WHAT FLOOR (INT)
// ==========================

// ---------- HELPERS ----------
function getClusterName(index) {
  const letter = String.fromCharCode(65 + index);
  return `${BUILDING}_${LEVEL}_${letter}`;
}

function nodeId(type, row, col) {
  const t = type === 'd' ? 'D' : 'J';
  return `${BUILDING}-${LEVEL}-${t}-${row}-${col}`;
}

// ---------- MAIN ----------
function main() {
  const raw = fs.readFileSync(INPUT_FILE, 'utf-8');

  const [nodeSection, locationSection] = raw.split('*');

  // =========================
  // 🔹 PART 1: NODES
  // =========================

  const nodeLines = nodeSection
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const parsedNodes = [];

  nodeLines.forEach(line => {
    const parts = line.split(/\s+/);
    if (parts.length !== 3) return;

    const type = parts[0].toLowerCase();
    const row = parseInt(parts[1]);
    const col = parseInt(parts[2]);

    if (!['d', 'j'].includes(type)) return;

    parsedNodes.push({ type, row, col });
  });

  const nodes = [];
  let prevNode = null;

  let clusterIndex = 0;
  let currentCluster = getClusterName(clusterIndex);

  const seenJunctions = new Set();

  for (let i = 0; i < parsedNodes.length; i++) {
    const { type, row, col } = parsedNodes[i];

    const id = nodeId(type, row, col);

    let isFork = false;

    // 🔥 FORK DETECTION FIRST
    if (type === 'j') {
      const key = `${row}-${col}`;

      if (seenJunctions.has(key)) {
        isFork = true;
        clusterIndex++;
        currentCluster = getClusterName(clusterIndex);
      } else {
        seenJunctions.add(key);
      }
    }

    const node = {
      node_id: id,
      building: BUILDING,
      floor: FLOOR,
      adjacents: [],
      attribute: ["walk"],
      clusterGroup: currentCluster,
      nodeType: type === 'd' ? 'door' : 'junction'
    };

    nodes.push(node);

    // 🔗 adjacency (skip if fork)
    if (prevNode && !isFork) {
      node.adjacents.push({ id: prevNode.node_id, weight: 1 });
      prevNode.adjacents.push({ id: node.node_id, weight: 1 });
    }

    prevNode = node;
  }

  // =========================
  // 🔹 PART 2: LOCATIONS
  // =========================

  const locationLines = locationSection
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const locations = [];

  locationLines.forEach(line => {
    // Format:
    // COM1 Seminar Room 1, 01-22: 6 7 6 8

    const [left, coordsPart] = line.split(':');
    if (!left || !coordsPart) return;

    const [namePart, roomNumber] = left.split(',');

    const name = namePart.trim();
    const room = roomNumber.trim();

    const tokens = coordsPart.trim().split(/\s+/);

    const doors = [];

    for (let i = 0; i < tokens.length; i += 2) {
      const row = parseInt(tokens[i]);
      const col = parseInt(tokens[i + 1]);

      if (!isNaN(row) && !isNaN(col)) {
        doors.push(nodeId('d', row, col));
      }
    }

    locations.push({
      name,
      roomNumber: room,
      building: BUILDING,
      floor: FLOOR,
      doors
    });
  });

  // =========================
  // 🔹 OUTPUT
  // =========================

  const output = {
    nodes,
    locations
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`✅ Nodes: ${nodes.length}`);
  console.log(`✅ Locations: ${locations.length}`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
}

main();