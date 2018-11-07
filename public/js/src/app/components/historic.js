Vue.component('historic', {

	template: `
		<div id="historic">
			<h3>Histórico de odio</h3>
			<span class="subtitle">
			Mostrar estadísticas de
				<select id="stats-dropdown" name="stats-dropdown" @change="onStatsDropdownChange">
					<option data-type="hour" data-number="1">Última hora</option>
					<option data-type="hour" data-number="3">Últimas 3 horas</option>
					<option data-type="hour" data-number="6">Últimas 6 horas</option>
					<option data-type="hour" data-number="12">Últimas 12 horas</option>
					<option data-type="hour" data-number="24">Últimas 24 horas</option>
					<!--<option data-type="day" data-number="3">Últimos 3 días</option>
					<option data-type="day" data-number="7">Últimos 7 días</option>-->
				</select>
			</span>

			<div class="stats-container">
				<canvas id="stats-canvas" width="800" height="300"></canvas>
			</div>
		</div>
  `,

	data() {
		return {
			historicStatsChart: null,
			rangeBetweenPoints: 1,
			parameters: {}
		}
	},

	created: function() {

		this.parameters.type = 'hour';
		this.parameters.number = 1;

		// Let's ask immediately for the most hated user
		socket.emit('retrieve_historic', this.parameters);

		// When we receive it, let's update the user
		socket.on('historic', function(data) {
			this.updateHistoric(data);
		}.bind(this));

	},

	methods: {

		onStatsDropdownChange: function(event) {

			var activeOption = document.getElementById('stats-dropdown').options[document.getElementById('stats-dropdown').selectedIndex];
			this.parameters.type = activeOption.getAttribute('data-type');
			this.parameters.number = activeOption.getAttribute('data-number');

			socket.emit('retrieve_historic', this.parameters);
		},

		updateHistoric: function(data) {

			console.log(data);

			// If previously created, we destroy it before creating a new one
			if (this.historicStatsChart) {
				this.historicStatsChart.destroy();
			}

			var resume = this.getResumeFromData(data);

			// Parse data for the graph
			var parsedData = this.parseHistoricDataForGraph(data);

			// Create new data array by intervals
			this.calculateDecimateRange(data);
			parsedData = this.decimate(parsedData);

			var ctx = document.getElementById("stats-canvas");
			var labels = this.getLabels(parsedData);
			var pointColors = this.getPointColors(data, 'rgba(138, 7, 7, 1)');

			this.historicStatsChart = new Chart(ctx, {
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
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero:true
							}
						}]
					},
					tooltips: {
						titleFontFamily: 'Ubuntu',
						bodyFontFamily: 'Ubuntu',
						footerFontFamily: 'Ubuntu',
						cornerRadius: 0,
						xPadding: 12,
						yPadding: 12,
						callbacks: {
							label: function(tooltipItem, data) {
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
				var minutes = point.t.getMinutes();
				var str = "" + minutes;
				var pad = "00";
				minutes = pad.substring(0, pad.length - str.length) + str;

				labels.push(point.t.getHours() + ':' + minutes);

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

		decimate: function(sample) {

			var blocksz = this.rangeBetweenPoints;
			if (blocksz == 1) return sample;

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

				var average = Math.floor(val.reduce(function(p,c,i,a){return p + (c/a.length)},0));

				new_sample.push({
					t: chunks[chunk][0]["t"],
					y: average
				});
			}

			return new_sample;
		},

		calculateDecimateRange: function() {

			// Last hour
			if (this.parameters.type === 'hour' && this.parameters.number == 1) {
				this.rangeBetweenPoints = 1;

				// Last 3 hours
			} else if (this.parameters.type === 'hour' && this.parameters.number == 3) {
				this.rangeBetweenPoints = 5;

				// Last 6 hours
			} else if (this.parameters.type === 'hour' && this.parameters.number == 6) {
				this.rangeBetweenPoints = 10;

				// Last 12 hours
			} else if (this.parameters.type === 'hour' && this.parameters.number == 12) {
				this.rangeBetweenPoints = 20;

				// Last 24 hours
			} else if (this.parameters.type === 'hour' && this.parameters.number == 24) {
				this.rangeBetweenPoints = 30;

			} else if (this.parameters.type === 'day') {
				this.rangeBetweenPoints = 60;
			}

		},

		getResumeFromData: function(data) {

			var resume = {};
			var hatedUsers = [];
			var hatefulUsers = [];
			var hatedUsersWithExamples = [];
			var hatedUsersComplete = [];

			// Get array with all hated users
			data.forEach(function(point) {
				hatedUsers.push(point.hated_user);
				hatedUsersWithExamples[point.hated_user] = {text:point.hated_user_example_tweet_text,id:point.hated_user_example_tweet_id,user:point.hated_user_example_tweet_id};
			});

			hatedUsers = lib.sortByFrequency(hatedUsers);
			console.log(hatedUsers);
			hatedUsers = hatedUsers.slice(0,5);
			hatedUsers.forEach(function(hatedUser) {
				hatedUsersComplete.push({user:hatedUser, tweet:hatedUsersWithExamples[hatedUser]});
			});

			resume.hatedUsers = hatedUsersComplete;
			console.log(resume);

			// Get array with all hateful users
			data.forEach(function(point) {
				hatefulUsers.push(point.hateful_user);
			});

			hatefulUsers = lib.sortByFrequency(hatefulUsers);
			resume.hatefulUsers = hatefulUsers;

			return resume;
		},

	}

});