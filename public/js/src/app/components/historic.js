Vue.component('historic', {

	template: `
		<div id="historic">
			<h3>Histórico de odio</h3>
			<span class="subtitle">
			Mostrar <select id="view-dropdown" name="view-dropdown" @change="onViewDropdownChange">
					<option value="graph">gráfico</option>
					<option value="resume">resumen</option>
				</select> de
				<select id="stats-dropdown" name="stats-dropdown" @change="onStatsDropdownChange">
					<option data-type="hour" data-number="1">última hora</option>
					<option data-type="hour" data-number="3">últimas 3 horas</option>
					<option data-type="hour" data-number="6">últimas 6 horas</option>
					<option data-type="hour" data-number="12">últimas 12 horas</option>
					<option data-type="hour" data-number="24">últimas 24 horas</option>
					<!--<option data-type="day" data-number="3">últimos 3 días</option>
					<option data-type="day" data-number="7">últimos 7 días</option>-->
				</select>
			</span>

			<div class="stats-container" v-show="showHistoricGraph">
				<canvas id="stats-canvas" width="800" height="300"></canvas>
			</div>

			<div class="resume-container" v-show="showHistoricResume">

				<section>
					<div class="user-message">El usuario que <b>más odio ha recibido</b> durante este tiempo ha sido <div class="user-container"><a target="_blank" :href="'https://twitter.com/' + resume.hatedUser.user" class="highlight-user">{{ resume.hatedUser.user }}</a></div></div>
					<div class="example-container">Ejemplo: <a target="_blank" :href="'https://twitter.com/' + resume.hatedUser.tweet.user + '/status/' + resume.hatedUser.tweet.id ">{{resume.hatedUser.tweet.text}}</a></div>
					<div class="others"><span class="hide-mobile">Otros:</span>
						<ul><li v-for="user in resume.hatedUser.others">
    						<a target="_blank" :href="'https://twitter.com/' + user.tweet.user + '/status/' + user.tweet.id">{{ user.user }}</a>
  						</li></ul>
					</div>
				</section>

				<section>
					<div class="user-message">El usuario que <b>más odio ha generado</b> durante este tiempo ha sido <div class="user-container"><a target="_blank" :href="'https://twitter.com/' + resume.hatefulUser.user" class="highlight-user">{{ resume.hatefulUser.user }}</a></div></div>
					<div class="example-container">Tuit: <a target="_blank" :href="'https://twitter.com/' + resume.hatefulUser.tweet.user + '/status/' + resume.hatefulUser.tweet.id ">{{resume.hatefulUser.tweet.text}}</a></div>
					<div class="others"><span class="hide-mobile">Otros:</span>
						<ul><li v-for="user in resume.hatefulUser.others">
    						<a target="_blank" :href="'https://twitter.com/' + user.tweet.user + '/status/' + user.tweet.id">{{ user.user }}</a>
  						</li></ul>
					</div>
				</section>

			</div>
		</div>
  `,

	data() {
		return {
			historicStatsChart: null,
			rangeBetweenPoints: 1,
			parameters: {},
			parsedData: {},
			showHistoricGraph: true,
			showHistoricResume: false,
			resume: {
				hatedUser: {
					user: '',
					tweet: {
						text: '',
						id: '',
						user: ''
					},
					others: []
				},
				hatefulUser: {
					user: '',
					tweet: {
						text: '',
						id: '',
						user: ''
					},
					others: []
				}
			}
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

		onViewDropdownChange: function(event) {

			var activeOption = document.getElementById('view-dropdown').value;

			if (activeOption == 'graph') {
				this.showHistoricGraph = true;
				this.showHistoricResume = false;
			} else { // resume
				this.showHistoricGraph = false;
				this.showHistoricResume = true;
			}
		},

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

			this.getResumeFromData(data);

			// Parse data for the graph
			this.parsedData = this.parseHistoricDataForGraph(data);

			// Create new data array by intervals
			this.calculateDecimateRange(data);
			this.parsedData = this.decimate(this.parsedData);

			var ctx = document.getElementById("stats-canvas");
			var labels = this.getLabels(this.parsedData);
			var pointColors = this.getPointColors(data, 'rgba(138, 7, 7, 1)');

			var that = this;

			this.historicStatsChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: labels,
					datasets: [{
						label: 'Tuits de odio por minuto',
						data: this.parsedData,
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
					hover: {
						mode: 'index',
						intersect: false
					},
					tooltips: {
						titleFontFamily: 'Ubuntu',
						bodyFontFamily: 'Ubuntu',
						footerFontFamily: 'Ubuntu',
						cornerRadius: 0,
						xPadding: 12,
						yPadding: 12,
						mode: 'index',
						intersect: false,
						callbacks: {
							label: function(tooltipItem, data) {
								var label = tooltipItem.yLabel + ' tuits de odio a las ' + tooltipItem.xLabel;
								return label;
							},
							title: function(tooltipItem, data) {
								return "Número de tuits de odio por minuto";
							},
							afterBody: function(tooltipItem, data) {
								var multistringText = [
									'------------------------------------------------------------------',
									'@' + that.parsedData[tooltipItem[0].index].hu2 + ' es el usuario que más odio ha generado',
									that.parsedData[tooltipItem[0].index].hu1 + ' es el usuario que más odio ha recibido'
								];

								return multistringText;
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
				parsedPoint.hu1 = point.hated_user;
				parsedPoint.hu2 = point.hateful_user;
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
				var hu1 = [];
				var hu2 = [];
				for (var i in chunks[chunk]) {
					val.push(chunks[chunk][i]["y"]);
					hu1.push(chunks[chunk][i]["hu1"]);
					hu2.push(chunks[chunk][i]["hu2"]);
				}

				var average = Math.floor(val.reduce(function(p,c,i,a){return p + (c/a.length)},0));
				hu1 = lib.sortByFrequency(hu1)[0];
				hu2 = lib.sortByFrequency(hu2)[0];

				new_sample.push({
					t: chunks[chunk][0]["t"],
					y: average,
					hu1: hu1,
					hu2: hu2
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

			// Initialize variables
			var resume = {};

			var hatedUsers = [];
			var hatedUsersWithExamples = [];
			var hatedUsersComplete = [];

			var hatefulUsers = [];
			var hatefulUsersWithExamples = [];
			var hatefulUsersComplete = [];

			// Get array with all hated users
			data.forEach(function(point) {
				hatedUsers.push(point.hated_user);
				hatedUsersWithExamples[point.hated_user] = {text:point.hated_user_example_tweet_text,id:point.hated_user_example_tweet_id,user:point.hated_user_example_tweet_user};
			});

			hatedUsers = lib.sortByFrequency(hatedUsers);
			hatedUsers = hatedUsers.slice(0,5);
			hatedUsers.forEach(function(hatedUser) {
				hatedUsersComplete.push({user:hatedUser, tweet:hatedUsersWithExamples[hatedUser]});
			});

			this.resume.hatedUser = hatedUsersComplete.shift();
			this.resume.hatedUser.others = hatedUsersComplete;

			// Get array with all hateful users
			data.forEach(function(point) {
				hatefulUsers.push(point.hateful_user);
				hatefulUsersWithExamples[point.hateful_user] = {text:point.hateful_user_tweet_text,id:point.hateful_user_tweet_id,user:point.hateful_user};
			});

			hatefulUsers = lib.sortByFrequency(hatefulUsers);
			hatefulUsers = hatefulUsers.slice(0,5);
			hatefulUsers.forEach(function(hatefulUser) {
				hatefulUsersComplete.push({user:hatefulUser, tweet:hatefulUsersWithExamples[hatefulUser]});
			});

			this.resume.hatefulUser = hatefulUsersComplete.shift();
			this.resume.hatefulUser.others = hatefulUsersComplete;

		},

	}

});