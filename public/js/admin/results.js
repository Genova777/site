"use strict";
$(".see-result").click(function(e, el){
	e.preventDefault();
	var url = $(el).attr("href");
	if(url != null){
		$.get(url, function(data){
			console.log(data);
		});
	}
});

function createGraph(chartId, resultData){
	var label = [];
	for(var i = 0; i < resultData.diff_ones_active.length; i++){
		label.push("");
	}
	var data = {
		labels: label,
		datasets: [{
				label: "Cumulative NbOnes-NbZeros",
				fillColor: "rgba(151,187,205,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: resultData.diff_ones_active
			}, {
				label: "Control line Cumulative NbOnes-NbZeros",
				fillColor: "#037800",
				strokeColor: "#037800",
				pointColor: "#037800",
				pointStrokeColor: "#037800",
				pointHighlightFill: "#037800",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: resultData.diff_ones_control
			}
		]
	};
	var options = {
		//Disable animation to limit CPU usage
		animation: false,
		datasetFill: false,
		datasetStroke: false,
		scaleShowLabels: true,
		pointDot: false,
		bezierCurve: false
	};
	var ctx = $(chartId).get(0).getContext("2d");
	var chart = new Chart(ctx).Line(data, options);
}

$.get("/admin/get_diff_ones_fountain.json", function(data){
		createGraph("#diff_ones_fountain", data);
	}
);
