Vue.component('real-time-graph', {

	template: `
		<div id="real_time_graph">
			<canvas id="real_time_canvas" width="400" height="100" 
			aria-label="Gráfico de número de tuits de odio por minuto que se actualiza en tiempo real"></canvas>
		</div>
  `,

	data() {

		return {
			initial_delay: 100,
			num_tweets_graph: 0,
			options: {},
			graph: null,
			line: null
		}
	},

	created: function () {

		var that = this;

		setTimeout(function () {

			that.initializeGraph();
			that.initializeLine();
			that.updateNumberOfTweetsGraph();

		}, this.initial_delay);

	},

	methods: {

		initializeGraph: function () {

			this.options = {
				maxValueScale: 1.28,
				grid: {
					fillStyle: '#ffffff',
					strokeStyle: '#f0f0f0',
					sharpLines: true
				},
				labels: {
					fillStyle: '#0d0d0d',
					precision: 0
				}
			};
			this.graph = new SmoothieChart(this.options);
			this.graph.streamTo(document.getElementById("real_time_canvas"), 0);
		},

		initializeLine: function () {

			var that = this;

			// Initialize line
			that.line = new TimeSeries();

			// Add a random value to each line every second
			setInterval(function () {
				that.line.append(new Date().getTime(), that.num_tweets_graph, false);
			}, 1000);

			// Add to line to graph
			that.graph.addTimeSeries(that.line, {
				lineWidth: 2,
				strokeStyle: '#CD2626'
			});
		},

		updateNumberOfTweetsGraph: function () {

			var that = this;

			socket.on('number_tweets', function (data) {
				that.num_tweets_graph = data.number_tweets;
			}.bind(this));
		}
	}

});