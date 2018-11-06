Vue.component('historic', {

	template: `
		<div id="historic">
			<h3>Histórico de odio</h3>
			<span class="subtitle">Recogiendo datos desde {{ first_date }}</span>

			<div class="stats-container">
				<canvas id="stats-canvas" width="800" height="300"></canvas>
			</div>
		</div>
  `,

	data() {
		return {
			first_date: ''
		}
	},

	created: function() {

		var parameters = {};
		parameters.type = 'hour';
		parameters.number = 1;

		// Let's ask immediately for the most hated user
		socket.emit('retrieve_historic', parameters);

		// When we receive it, let's update the user
		socket.on('historic', function(data) {
			this.updateHistoric(data);
		}.bind(this));

	},

	methods: {

		updateHistoric: function(data) {

			var ctx = document.getElementById("stats-canvas");
			var parsedData = this.parseHistoricDataForGraph(data);
			var labels = this.getLabels(parsedData);
			var pointColors = this.getPointColors(data, 'rgba(138, 7, 7, 1)');

			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
						label: 'Tuits de odio por minuto',
						data: parsedData,
						backgroundColor: [
							'rgba(138,7,7,0.1)'
						],
						borderColor: [
							'rgba(138, 7, 7, 1)'
						],
						pointBackgroundColor: pointColors,
						pointBorderColor: pointColors,
						borderWidth: 2
					}]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero:true
							}
						}]
					},
					tooltips: {
						callbacks: {
							label: function(tooltipItem, data) {
								console.log(tooltipItem, data.datasets[tooltipItem.datasetIndex]);

								var label = tooltipItem.yLabel + ' tuits de odio a las ' + tooltipItem.xLabel;
								return label;
							},
							title: function(tooltipItem, data) {
								return "Número de tuits de odio por minuto";
							}
						}
					}
				}
			});
		},

		parseHistoricDataForGraph: function(data) {

			var parsedData = [];

			data.forEach(function(point) {

				var parsedPoint = {};
				parsedPoint.t = new Date(point.date);
				parsedPoint.y = point.number_tweets;
				parsedData.push(parsedPoint);

			});

			return parsedData;

		},

		getLabels: function(parsedData) {

			var labels = [];

			parsedData.forEach(function(point) {

				point.t.setHours(point.t.getHours()+1);
				labels.push(point.t.getHours() + ':' + point.t.getMinutes());

			});

			return labels;

		},

		getPointColors: function(data, color) {

			var pointColors = [];

			for (var i = 0; i < data.length; i++) {
				pointColors.push(color);
			}

			return pointColors;
		},

		decimate: function(sample, blocksz) {
			var chunks = [];

			// Chunk up the sample
			while (sample.length > 0) {
				chunks.push(sample.splice(0, blocksz));
			}

			var new_sample = [];
			// Process each chunk, and downsample
			for (var chunk in chunks) {

				var val = [];
				for (var i in chunks[chunk]) {
					val.push(chunks[chunk][i]["y"]);
				}

				new_sample.push({
					x: chunks[chunk][Math.floor(chunks[chunk].length/2)]["x"],
					y: math.mean(val)
				});
			}

			return new_sample;
		}

	}

});