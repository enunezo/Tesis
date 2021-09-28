var graph = Viva.Graph.graph();

var theUI = {"nodes":{"temis":{"color":"red", "shape":"rect", "label":"Temis", "alpha":1, "link":"http://www.temis.com/fr"}, "colombia":{"color":"green", "shape":"dot", "label":"Colombia", "alpha":1}, "paris":{"color":"blue", "shape":"dot", "label":"Paris", "alpha":1}, "luxidNav":{"color":"#000000", "shape":"dot", "label":"Lux-Nav", "alpha":0.4}, "navigator":{"color":"green", "shape":"dot", "label":"Navigator", "alpha":1}, "luxid":{"color":"blue", "shape":"dot", "label":"Luxid X", "alpha":1}}, "edges":{"temis":{"colombia":{"directed":"true", "color":"#FFA500", "name":"Headquarter", "weight":4}, "paris":{"directed":"false", "color":"#FFA500", "name":"subsidiary", "weight":1}}, "paris":{"colombia":{"name":"vpn", "weight":1}, "luxid":{"weight":1}}, "colombia":{"navigator":{"weight":1}}, "luxidNav":{"luxid":{"directed":"true", "color":"#FFA500", "weight":4}, "navigator":{"weight":1}}}};
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