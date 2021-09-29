(async () => {

  let resp = await fetch('triplets.json');
  let tripletsData = await resp.json();
  tripletsData = tripletsData.slice(0, 10000)
  let nounsMap = {}
  let verbsMap = {}
  let relationsMap = {}
  tripletsData.forEach(t => {
    verbsMap[t.verb] = true;
  })
  tripletsData.forEach(t => {
    nounsMap[t.nouns[0]] = true;
    nounsMap[t.nouns[1]] = true;
  })
  tripletsData.forEach(t => {
    relationsMap[t.verb+'-'+t.nouns[0]] = true;
    relationsMap[t.verb+'-'+t.nouns[1]] = true;
  })
  


  
  var graph = Viva.Graph.graph();
  
  var theUI = { nodes: {}, edges: {} }
  Object.keys(verbsMap).forEach(k => {
    theUI.nodes[k] = {
      "color": "green",
      "shape": "dot",
      "label": k,
      "alpha": 1
    }
  })
  Object.keys(nounsMap).forEach(k => {
    theUI.nodes[k] = {
      "color": "blue",
      "shape": "dot",
      "label": k,
      "alpha": 1
    }
  })
  Object.keys(relationsMap).forEach(k => {
    let k1 = k.split('-')[0];
    let k2 = k.split('-')[1];
    theUI.edges[k1] = theUI.edges[k1] || {};
    theUI.edges[k1][k2] = { weight: 1 }
  })


  var _theUI = {
    "nodes": {
      "luxid": {
        "color": "blue",
        "shape": "dot",
        "label": "Luxid X",
        "alpha": 1
      },
      "asd": {
        "color": "blue",
        "shape": "dot",
        "label": "Luxid X",
        "alpha": 1
      },
    },
    "edges": {
      "luxid": {
        "asd": {
          "weight": 1
        }
      }
    }
  }
  var nodeuidata = theUI.nodes;
  if (theUI.nodes)
      $.each(theUI.nodes, function(name, nodeData) {
        graph.addNode(name, nodeData);
      })
  
    if (theUI.edges)
      $.each(theUI.edges, function(src, dsts) {
        $.each(dsts, function(dst, edgeData) {
          graph.addLink(src, dst, edgeData);
        })
      })
      
    var graphics = Viva.Graph.View.svgGraphics(), nodeSize = 24;
  
    var layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : 100,
      springCoeff : 0.0008,
      dragCoeff : 0.02,
      gravity : -1.2
    });
  
    var renderer = Viva.Graph.View.renderer(graph, {
      layout : layout,
      graphics : graphics
    });
  
  
    graphics.node(
        function(node) {
          var ui = Viva.Graph.svg('g'),
          svgText = Viva.Graph.svg('text').attr('y', '-4px').attr('x',
              '-' + (nodeSize / 4) + 'px').text(node.data.label),
  
          img = node.data.image ? Viva.Graph.svg('image').attr('width',
              nodeSize).attr('height', nodeSize)
              .link(
                  'https://secure.gravatar.com/avatar/'
                      + node.data.image) : Viva.Graph.svg(
              'rect').attr('width', nodeSize)
              .attr('height', nodeSize).attr('fill',
                  node.data.color ? node.data.color : '#00a2e8');
          $(ui).hover(function() {
                      //
            //HERE IS WHERE I WISH TO CHANGE MY NODE COLOR
                      //
          }, function() {
            
          });
  
          $(ui).mousedown(function(e) {
                      //
                      //OR ALSO HERE BUT I GUESS IT'S SAME		
                      //
          });
  
          $(ui).mouseup(
              function(e) {
                
          });
  
          ui.append(svgText);
          ui.append(img);
          return ui;
        }).placeNode(
        function(nodeUI, pos) {
          nodeUI.attr('transform', 'translate(' + (pos.x - nodeSize / 2)
              + ',' + (pos.y - nodeSize / 2) + ')');
        });
  
  
    graphics
        .link(
            function(link) {
              var colortmp = (link.data) && (link.data.color) ? link.data.color
                  : "#000000"
              return Viva.Graph.svg('path').attr('stroke', colortmp);
            }).placeLink(
            function(linkUI, fromPos, toPos) {
              var data = 'M' + fromPos.x + ',' + fromPos.y + 'L'
                  + toPos.x + ',' + toPos.y;
  
              linkUI.attr("d", data);
            });
  
    renderer.run();
  
    document.oncontextmenu = function() {
      return false;
    }

})()