Vue.component('historic', {

	template: `
		<div id="historic">
			<h3>{{ $t("historic.title") }}</h3>
			<span class="subtitle">
			{{ $t("historic.show") }} <select id="view-dropdown" name="view-dropdown" @change="onViewDropdownChange">
					<option value="graph">{{ $t("historic.type_graph.graph") }}</option>
					<option value="hateful">{{ $t("historic.type_graph.hateful") }}</option>
					<option value="hated">{{ $t("historic.type_graph.hated") }}</option>
				</select> {{ $t("historic.for") }}
				<select id="stats-dropdown" name="stats-dropdown" @change="onStatsDropdownChange">
					<option data-type="hour" data-number="1">{{ $t("historic.time_graph.last_fs") }} {{ $t("historic.time_graph.hour_s") }}</option>
					<option data-type="hour" data-number="3">{{ $t("historic.time_graph.last_fp") }} 3 {{ $t("historic.time_graph.hour_p") }}</option>
					<option data-type="hour" data-number="6">{{ $t("historic.time_graph.last_fp") }} 6 {{ $t("historic.time_graph.hour_p") }}</option>
					<option data-type="hour" data-number="12">{{ $t("historic.time_graph.last_fp") }} 12 {{ $t("historic.time_graph.hour_p") }}</option>
					<option data-type="hour" data-number="24">{{ $t("historic.time_graph.last_fp") }} 24 {{ $t("historic.time_graph.hour_p") }}</option>
					<option data-type="day" data-number="3">{{ $t("historic.time_graph.last_mp") }} 3 {{ $t("historic.time_graph.day_p") }}</option>
					<option data-type="day" data-number="7">{{ $t("historic.time_graph.last_mp") }} 7 {{ $t("historic.time_graph.day_p") }}</option>
				</select>
			</span>

			<div class="stats-container" v-show="showHistoricGraph">
				<canvas id="stats-canvas" width="800" height="300"></canvas>
			</div>

			<div class="resume-container hated-container" v-show="showHatedResume">

				<section>
					<div class="user-message"><div class="user-container"><a target="_blank" :href="'https://twitter.com/' + resume.hatedUser.user" class="highlight-user">{{ resume.hatedUser.user }}</a></div><span v-html='$t("historic.resume.hated")'></span></div>
					<div class="example-container"><a target="_blank" :href="'https://twitter.com/' + resume.hatedUser.tweet.user + '/status/' + resume.hatedUser.tweet.id ">{{resume.hatedUser.tweet.text}}</a></div>
					<div class="others"><span class="hide-mobile">{{ $t("historic.resume.others") }}:</span>
						<ul><li v-for="user in resume.hatedUser.others">
    						<a target="_blank" :href="'https://twitter.com/' + user.tweet.user + '/status/' + user.tweet.id">{{ user.user }}</a>
  						</li></ul>
					</div>
				</section>

			</div>

			<div class="resume-container hateful-container" v-show="showHatefulResume">

				<section>
					<div class="user-message"><div class="user-container"><a target="_blank" :href="'https://twitter.com/' + resume.hatefulUser.user" class="highlight-user">@{{ resume.hatefulUser.user }}</a></div><span v-html='$t("historic.resume.hateful")'></span></div>
					<div class="example-container"><a target="_blank" :href="'https://twitter.com/' + resume.hatefulUser.tweet.user + '/status/' + resume.hatefulUser.tweet.id ">{{resume.hatefulUser.tweet.text}}</a></div>
					<div class="others"><span class="hide-mobile">{{ $t("historic.resume.others") }}:</span>
						<ul><li v-for="user in resume.hatefulUser.others">
    						<a target="_blank" :href="'https://twitter.com/' + user.tweet.user + '/status/' + user.tweet.id">@{{ user.user }}</a>
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
			graphData: {},
			showHistoricGraph: true,
			showHatedResume: false,
			showHatefulResume: false,
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
				this.showHatedResume = false;
				this.showHatefulResume = false;
			} else if (activeOption == 'hated') {
				this.showHistoricGraph = false;
				this.showHatedResume = true;
				this.showHatefulResume = false;
			} else { // hateful
				this.showHistoricGraph = false;
				this.showHatedResume = false;
				this.showHatefulResume = true;
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

			this.resume = data.resume;

			// Parse data for the graph
			this.graphData = data.graphData;
			this.averageData = data.averageData;

			// Create new data array by intervals
			var ctx = document.getElementById("stats-canvas");
			var pointColors = this.getPointColors(this.graphData, 'rgba(138, 7, 7, 1)');

			var that = this;

			this.historicStatsChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: data.labels,
					datasets: [

						// GRAPH DATA
						{
							data: this.graphData,
							backgroundColor: [
								'rgba(138,7,7,0.1)'
							],
							borderColor: [
								'rgba(138, 7, 7, 1)'
							],
							pointBackgroundColor: pointColors,
							pointBorderColor: pointColors,
							pointRadius: 0,
							borderWidth: 2
						},
						// AVERAGE DATA
						{
							data: this.averageData,
							backgroundColor: false,
							fill: false,
							borderColor: 'rgba(0, 0, 0, .5)',
							borderDash: [5, 5],
							borderWidth: 2,
							pointRadius: 0
						}
					]
				},
				options: {
					maintainAspectRatio: false,
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							},
							gridLines: {
								color: "#eeeeee"
							}
						}],
						xAxes: [{
							gridLines: {
								color: "#eeeeee"
							}
						}]
					},
					hover: {
						mode: 'index',
						intersect: false
					},
					tooltips: {
						titleFontFamily: 'Montserrat Regular',
						bodyFontFamily: 'Montserrat Regular',
						footerFontFamily: 'Montserrat Regular',
						cornerRadius: 0,
						xPadding: 12,
						yPadding: 12,
						mode: 'index',
						intersect: false,
						callbacks: {
							label: function(tooltipItem, data) {
								var label = tooltipItem.yLabel + that.$t('historic.graph.tweets_at') + tooltipItem.xLabel;
								if (tooltipItem.datasetIndex == 1) {
									label = tooltipItem.yLabel + that.$t('historic.graph.average_tweets_at') + tooltipItem.xLabel;
								}
								return label;
							},
							title: function(tooltipItem, data) {
								return that.$t('historic.graph.number_tweets');
							},
							afterBody: function(tooltipItem, data) {
								var multistringText = [
									'------------------------------------------------------------------',
									'@' + that.graphData[tooltipItem[0].index].hu2 + that.$t('historic.graph.hateful'),
									that.graphData[tooltipItem[0].index].hu1 + that.$t('historic.graph.hated')
								];

								return multistringText;
							}
						}
					}
				}
			});
		},

		getPointColors: function(data, color) {

			var pointColors = [];

			for (var i = 0; i < data.length; i++) {
				pointColors.push(color);
			}

			return pointColors;
		},


	}

});