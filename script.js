let network = null;

function clearNetwork() {
  if (network) {
    network.destroy();
    network = null;
  }
  document.getElementById("network").innerHTML = "";
}

function drawTopology(type) {
  clearNetwork();

  let nodes = new vis.DataSet();
  let edges = new vis.DataSet();

  const container = document.getElementById("network");
  const options = {
    physics: { enabled: type !== "tree" }, // tree looks better without physics
    layout: { hierarchical: type === "tree" ? {
      direction: "UD",
      sortMethod: "directed"
    } : undefined },
    nodes: {
      shape: "dot",
      size: 28,
      font: { size: 14, face: "system-ui" },
      borderWidth: 2
    },
    edges: {
      width: 2,
      arrows: type === "tree" ? "to" : undefined,
      smooth: type === "ring" || type === "mesh" ? false : true
    }
  };

  switch(type) {
    case "star":
      nodes.add({id: 0, label: "Switch", color: "#3498db", shape: "box", size: 40});
      for(let i = 1; i <= 8; i++) {
        nodes.add({id: i, label: `PC${i}`, color: "#f1c40f"});
        edges.add({from: 0, to: i});
      }
      break;

    case "bus":
      for(let i = 1; i <= 7; i++) {
        nodes.add({id: i, label: `PC${i}`, color: "#2ecc71"});
        if (i > 1) edges.add({from: i-1, to: i});
      }
      break;

    case "ring":
      for(let i = 1; i <= 7; i++) {
        nodes.add({id: i, label: `PC${i}`, color: "#e74c3c"});
        edges.add({from: i, to: i % 7 + 1});
      }
      break;

    case "mesh":
      for(let i = 1; i <= 6; i++) {
        nodes.add({id: i, label: `Dev${i}`, color: "#9b59b6"});
      }
      for(let i = 1; i <= 6; i++) {
        for(let j = i+1; j <= 6; j++) {
          edges.add({from: i, to: j});
        }
      }
      break;

    case "tree":
      const levels = [
        {id: 0, label: "Core Router", level: 0, color: "#c0392b"},
        {id: 1, label: "Dist 1", level: 1, color: "#2980b9"},
        {id: 2, label: "Dist 2", level: 1, color: "#2980b9"},
        {id: 3, label: "Access 1", level: 2, color: "#f39c12"},
        {id: 4, label: "Access 2", level: 2, color: "#f39c12"},
        {id: 5, label: "Access 3", level: 2, color: "#f39c12"},
        {id: 6, label: "PC 1-1", level: 3, color: "#27ae60"},
        {id: 7, label: "PC 1-2", level: 3, color: "#27ae60"}
      ];

      nodes.add(levels);

      edges.add([
        {from: 0, to: 1}, {from: 0, to: 2},
        {from: 1, to: 3}, {from: 1, to: 4},
        {from: 2, to: 5},
        {from: 3, to: 6}, {from: 3, to: 7}
      ]);
      break;
  }

  network = new vis.Network(container, {nodes, edges}, options);

  document.getElementById("description").textContent = 
    `Showing: ${type.charAt(0).toUpperCase() + type.slice(1)} Topology`;
}

function drawSelectedTopology() {
  const select = document.getElementById("topologySelect");
  const type = select.value;
  drawTopology(type);
}

// Draw star by default when page loads
window.onload = () => drawTopology("star");