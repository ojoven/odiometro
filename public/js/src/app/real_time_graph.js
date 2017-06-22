Vue.component('real-time-graph', {
	template: `
		<div id="real_time_graph">
			<canvas id="canvas" width="400" height="100"></canvas>
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
	created: function() {

		setTimeout(function() {

			var that = this;

			// Initialize graph and lines
			that.line = new TimeSeries();
			that.options = { maxValueScale: 1.28, grid: { fillStyle:'#ffffff', strokeStyle: '#f0f0f0', sharpLines: true } ,labels: {fillStyle: '#0d0d0d', precision: 0 } };
			that.graph = new SmoothieChart(that.options);
			that.graph.streamTo(document.getElementById("canvas"), 0);

			// Add a random value to each line every second
			setInterval(function() {
				that.line.append(new Date().getTime(), that.num_tweets_graph, false);
			}, 1000);

			// Add to line to graph
			that.graph.addTimeSeries(that.line, { lineWidth:2, strokeStyle:'#CD2626' } );

			// Update the number of tweets
			socket.on('number_tweets', function(data) {
				that.num_tweets_graph = data.number_tweets;
			}.bind(this));

		}, this.initial_delay);

	},
	methods: {
		
	}

});