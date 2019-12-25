var canvas = document.querySelector("canvas");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach(button => {
	button.addEventListener("click", () => {
		const modal = document.querySelector(button.dataset.modalTarget);
		openModal(modal);
	});
});

overlay.addEventListener("click", () => {
	const modals = document.querySelectorAll(".modal.active");
	modals.forEach(modal => {
		closeModal(modal);
	});
});

closeModalButtons.forEach(button => {
	button.addEventListener("click", () => {
		const modal = button.closest(".modal");
		closeModal(modal);
	});
});

function openModal(modal) {
	if (modal == null) return;
	modal.classList.add("active");
	overlay.classList.add("active");
}

function closeModal(modal) {
	if (modal == null) return;
	modal.classList.remove("active");
	overlay.classList.remove("active");
}
var context = canvas.getContext("2d");
const width = window.innerWidth;
const height = window.innerHeight;
const pixelRatio = window.devicePixelRatio || 1;

canvas.width = width * pixelRatio;
canvas.height = height * pixelRatio;

canvas.style.width = `${width}px`;
canvas.style.height = `${height}px`;

// for sprites scaled up to retina resolution
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

context.scale(pixelRatio, pixelRatio);
var line_count = 0;

canvas.addEventListener("mousedown", doMouseClick1, false);
const radius = 25;
var weightCount = 0;

class Vertex {
	constructor(id, x, y) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.draw = function(color) {
			context.beginPath();
			context.fillStyle = color;
			context.arc(this.x, this.y, radius, 0, Math.PI * 2);
			context.fill();
			context.strokeStyle = "black";
			context.stroke();
			context.fillStyle = "black";
			context.font = "30px Courier New";
			context.fillText(this.id.toString(), this.x - 8, this.y + 10);
		};
	}
}

class Line {
	constructor(x1, y1, x2, y2, v1, v2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.v1 = v1;
		this.v2 = v2;
		this.draw = function(color) {
			context.beginPath();
			context.strokeStyle = color;
			if (color == "purple") {
				context.lineWidth = 3;
			} else context.lineWidth = 1;
			context.moveTo(this.x1, this.y1);
			context.lineTo(this.x2, this.y2);
			context.stroke();
			context.fillStyle = "white";
			this.mid1 = (this.x1 + this.x2) / 2;
			this.mid2 = (this.y1 + this.y2) / 2;
			context.beginPath();
			context.arc(this.mid1, this.mid2, 12, 0, Math.PI * 2);
			context.fillStyle = "white";
			context.fill();
		};
		this.clear = function() {
			context.beginPath();
			context.strokeStyle = "white";
			context.lineWidth = 4;
			context.moveTo(this.x1, this.y1);
			context.lineTo(this.x2, this.y2);
			context.stroke();
			context.fillStyle = "white";
			this.mid1 = (this.x1 + this.x2) / 2;
			this.mid2 = (this.y1 + this.y2) / 2;
			context.beginPath();
			context.arc(this.mid1, this.mid2, 12, 0, Math.PI * 2);
			context.fillStyle = "white";
			context.fill();
		};
	}
}

class Graph {
	constructor() {
		this.verticies = [];
		this.num_verticies = 0;
		this.num_edges = 0;
		this.adjList = {};
		//prev = [{ id: null }, { id: null }];
		this.add_edge = function(start, end, w) {
			this.num_edges++;
			if (start != end && start != Infinity) {
				clicked = true;
				clickedEdge = true;
				if (start in this.adjList) {
					for (var i = 0; i < this.adjList[start].length; i++) {
						if (this.adjList[start][i].id == end) break;
					}
					if (i - 1 == this.adjList[start].length)
						this.adjList[start].push({ id: end, weight: w });
					else this.adjList[start][i] = { id: end, weight: w };
				} else {
					this.adjList[start] = [{ id: end, weight: w }];
				}
				if (end in this.adjList) {
					for (var i = 0; i < this.adjList[end].length; i++) {
						if (this.adjList[end][i].id == start) break;
					}
					if (i - 1 == this.adjList[end].length)
						this.adjList[end].push({ id: start, weight: w });
					else this.adjList[end][i] = { id: start, weight: w };
				} else {
					this.adjList[end] = [{ id: start, weight: w }];
				}
				this.x_y1 = this.verticies.find(element => element.id == start);
				this.x_y2 = this.verticies.find(element => element.id == end);
				lineText(this.x_y1.x, this.x_y1.y, this.x_y2.x, this.x_y2.y, w);
			}
		};
		this.add_vertex = function(v) {
			this.verticies.push(v);
			this.num_verticies++;
		};
	}
}

G = new Graph();
//console.log(G.num_verticies);
vertexObjects = [];
lineObjects = [];
function doMouseClick1() {
	pos = getMousePos(canvas, event);
	vl = G.num_verticies;
	if (vl == 0) {
		vert_id = 0;
		var v = new Vertex(vert_id, pos.x, pos.y);
		v.draw("white");
		G.add_vertex(v);
		vertexObjects.push(v);
		clicked = true;
		clickedEdge = true;
	} else {
		flag = true;
		for (var i = 0; i < vl; i++) {
			vertx = G.verticies[i].x;
			verty = G.verticies[i].y;
			if (circle_bounds(vertx, verty, pos.x, pos.y)) {
				linex1 = vertx;
				liney1 = verty;
				//console.log(linex1, liney1);
				canvas.addEventListener("mouseup", doMouseClick2, false);
				flag = false;
				break;
			}
		}
		if (flag) {
			if (clicked) {
				vert_id++;
				var v = new Vertex(vert_id, pos.x, pos.y, "white");
				v.draw("white");
				G.add_vertex(v);
				vertexObjects.push(v);
				clicked = false;
			} else {
				alert("Error! Must add a weight to every node");
			}
		}
	}
}

function doMouseClick2() {
	//console.log(getMousePos(canvas, event));
	//console.log("mouse up");
	vl = G.num_verticies;
	pos_down = getMousePos(canvas, event);
	for (var i = 0; i < vl; i++) {
		vertx = G.verticies[i].x;
		verty = G.verticies[i].y;
		vert1 = G.verticies[i];
		if (circle_bounds(vertx, verty, pos_down.x, pos_down.y)) break;
	}
	if (linex1 != -1 && circle_bounds(vertx, verty, pos_down.x, pos_down.y)) {
		if (clickedEdge) {
			// vert2 = G.verticies.find(element => {
			// 	element.x == linex1 && element.y == liney1;
			// });
			// chk2 = prev.some(element => {
			// 	return element[0].id == vert1.id && element[1].id == vert2.id;
			// });
			// console.log("Check: ", chk2);
			// if (!chk2) {
			line_count++;
			//console.log("Lines added", line_count);
			[x1_edge, y1_edge] = circle_edge(vertx, verty, linex1, liney1);
			[x2_edge, y2_edge] = circle_edge(linex1, liney1, vertx, verty);
			start = G.verticies.find(
				element1 => element1.x === linex1 && element1.y === liney1
			);
			end = G.verticies.find(
				element2 => element2.x === vertx && element2.y === verty
			);
			line = new Line(x1_edge, y1_edge, x2_edge, y2_edge, start.id, end.id);
			//console.log(start.id, end.id);
			document.getElementById("vertex1").innerHTML = start.id.toString();
			document.getElementById("vertex2").innerHTML = end.id.toString();
			line.clear();
			line.draw("black");
			lineObjects.push(line);
			linex1 = -1;
			clickedEdge = false;
			// } else {
			// 	alert("Nooo!");
			// }
		} else {
			alert("Error! Must add a weight to every node");
		}
	} else {
		clicked = true;
	}
}

function lineText(x1, y1, x2, y2, text) {
	midx = (x1 + x2) / 2;
	midy = (y1 + y2) / 2;
	context.beginPath();
	context.arc(midx, midy, 12, 0, Math.PI * 2);
	context.fillStyle = "white";
	context.fill();
	context.font = "20px Courier New";
	context.fillStyle = "black";
	context.fillText(text.toString(), midx - 5, midy + 7);
}

// function vertText(vert, dist) {
// 	// context.beginPath();
// 	// context.fillStyle = "white";
// 	// context.strokeStyle = "black";
// 	// context.rect(vert.x - 12, vert.y + 20, 25, 25);
// 	// context.stroke();
// 	context.font = "12px Courier New";
// 	context.fillStyle = "black";
// 	console.log("V and dist ", vert, dist);
// 	str =
// 		"Djikstra(0, " + vert.id.toString() + ")" + "-> " + dist.toString() + "   ";
// 	context.fillText(str, vert.x - 10, vert.y + 40);
// }

function circle_edge(x1, y1, x2, y2) {
	len_q = Math.sqrt(Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2);
	len_b = Math.abs(y1 - y2);
	shift_y = (radius / len_q) * len_b;
	shift_x = Math.sqrt(radius ** 2 - shift_y ** 2);
	if (x1 < x2) x2 = x2 - shift_x;
	else x2 = x2 + shift_x;
	if (y1 > y2) y2 = y2 + shift_y;
	else y2 = y2 - shift_y;
	return [x2, y2];
}

function circle_bounds(xc, yc, xp, yp) {
	d = Math.sqrt((xp - xc) ** 2 + (yp - yc) ** 2);
	if (d < radius) return true;
	return false;
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

function weightInp() {
	var weight = document.getElementById("weight").value;
	if (weight != parseInt(weight, 10) && weight != "") {
		alert(weight + " is not a number");
		//G.add_edge(Infinity, 0, 0);
	} else if (weight == "") {
		// console.log(prev[0][0].id);
		// console.log(start.id);
		// console.log(prev);
		G.add_edge(start.id, end.id, Math.floor(Math.random() * 9 + 1));
		//prev.push([start, end]);
	} else {
		weight = parseInt(weight, 10);
		document.getElementById("weight").value = "";
		G.add_edge(start.id, end.id, weight);
		//prev.push([start, end]);
	}
}

class PriorityQueue {
	constructor() {
		this.collection = [];
	}
	enqueue(element) {
		if (this.isEmpty()) {
			this.collection.push(element);
		} else {
			let added = false;
			for (let i = 1; i <= this.collection.length; i++) {
				if (element[1] < this.collection[i - 1][1]) {
					this.collection.splice(i - 1, 0, element);
					added = true;
					break;
				}
			}
			if (!added) {
				this.collection.push(element);
			}
		}
	}
	dequeue() {
		let value = this.collection.shift();
		return value;
	}
	isEmpty() {
		return this.collection.length === 0;
	}
}

function findPathWithDijkstra() {
	// lineObjects.forEach(line => {
	// 	line.clear();
	// });
	[startNode, endNode] = [0, G.verticies[G.num_verticies - 1].id];
	let weights = {};
	let backtrace = {};
	let pq = new PriorityQueue();
	//console.log(startNode, endNode);

	weights[startNode] = 0;

	G.verticies.forEach(node => {
		if (node.id !== startNode) {
			//console.log(node.id);
			weights[node.id] = Infinity;
		}
	});

	pq.enqueue([startNode, 0]);
	while (!pq.isEmpty()) {
		let shortestStep = pq.dequeue();
		let currentNode = shortestStep[0];
		vertexObjects[currentNode].draw("red");
		G.adjList[currentNode].forEach(neighbor => {
			//console.log("Here2");
			//For each neihbor of the current node check weight
			let weight = weights[currentNode] + neighbor.weight;
			//Weights neighbor.val is the neigbors dist from start vertex
			if (weight < weights[neighbor.id]) {
				neig = G.verticies.find(element => element.id === neighbor.id);
				weights[neighbor.id] = weight;
				[xl1, yl1] = circle_edge(
					G.verticies[currentNode].x,
					G.verticies[currentNode].y,
					G.verticies[neighbor.id].x,
					G.verticies[neighbor.id].y
				);
				[xl2, yl2] = circle_edge(
					G.verticies[neighbor.id].x,
					G.verticies[neighbor.id].y,
					G.verticies[currentNode].x,
					G.verticies[currentNode].y
				);
				lineObj = lineObjects.find(
					element =>
						(element.v1 === currentNode && element.v2 === neighbor.id) ||
						(element.v2 === currentNode && element.v1 === neighbor.id)
				);
				//console.log(lineObj);
				//lineObj.clear();
				//lineObj.draw("green");

				lineText(
					lineObj.x1,
					lineObj.y1,
					lineObj.x2,
					lineObj.y2,
					neighbor.weight
				);
				backtrace[neighbor.id] = currentNode;
				//Enqueue Neighbor with least weight
				pq.enqueue([neighbor.id, weight]);
				//vertexObjects[currentNode].draw("blue");
			}
		});
	}
	//console.log("END");
	let path = [endNode];
	let lastStep = endNode;
	while (lastStep !== startNode) {
		path.unshift(backtrace[lastStep]);
		lastStep = backtrace[lastStep];
		//console.log("here3");
	}
	for (var i = 0; i < path.length - 1; i++) {
		//console.log("Here2");
		lineObj = lineObjects.find(
			element =>
				(element.v1 === path[i] && element.v2 === path[i + 1]) ||
				(element.v2 === path[i] && element.v1 === path[i + 1])
		);
		lineObj.clear();
		lineObj.draw("purple");
		//console.log(path[i], path[i + 1]);
		wei = G.adjList[path[i]].find(element => element.id === path[i + 1]);
		lineText(lineObj.x1, lineObj.y1, lineObj.x2, lineObj.y2, wei.weight);
	}
	//console.log(`Path is ${path} and time is ${weights[endNode]}`);
}

function BFS() {
	// Create a Queue and add our initial node in it
	node = G.verticies[0].id;
	let q = new PriorityQueue();
	let explored = new Set();
	q.enqueue(node);

	// Mark the first node as explored explored.
	explored.add(node);

	// We'll continue till our queue gets empty
	while (!q.isEmpty()) {
		let t = q.dequeue();
		//console.log(lineObjects);
		G.adjList[t].forEach(neighbor => {
			edge = lineObjects.find(line => {
				//console.log("TL", typeof line);
				//console.log("TN", typeof neighbor);
				line.v1 === neighbor.id;
			});
			console.log(t, "---->", edge);
		});

		// Log every element that comes out of the Queue
		//console.log("Popping", t);

		// 1. In the edges object, we search for nodes this node is directly connected to.
		// 2. We filter out the nodes that have already been explored.
		// 3. Then we marxk each unexplored node as explored and add it to the queue.
		G.adjList[t]
			.filter(n => !explored.has(n.id))
			.forEach(n => {
				explored.add(n.id);
				q.enqueue(n.id);
			});
	}
}
