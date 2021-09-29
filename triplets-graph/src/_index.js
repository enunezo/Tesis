// import "./styles.css";
// import Viva from "vivagraphjs";

var graph = Viva.Graph.graph();
graph.addLink(1, 2);

// specify where it should be rendered:
var renderer = Viva.Graph.View.renderer(graph, {
  container: document.getElementById("app")
});
renderer.run();

// document.getElementById("app").innerHTML = `
// <h1>Hello Vanilla!</h1>
// <div>
//   We use Parcel to bundle this sandbox, you can find more info about Parcel
//   <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
// </div>
// `;
