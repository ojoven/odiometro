const tweets = new Vue({
	el:	'#tweets',
	data: {
		tweet: "",
		track: []
	},
	created: function() {

		// Update tweet socket
		socket.on('tweet', function(tweet) {
			this.updateTweet(tweet);
		}.bind(this));

		// Retrieve the tracked queries (so we can highlight them in the tweets)
		var that = this;
		axios.get('/track.json')
			.then(function (response) {
				console.log(response.data);
				that.track = response.data;
			});

	},
	methods: {
		updateTweet: function(tweet) {
			//var parsedTweet = this.parseTweet(tweet);
			this.tweet = tweet;
		},
		parseTweet: function(tweet) {

			parsedTweet = tweet;

			for (var i in this.track) {
				console.log(this.track[i]);
				tweet = tweet.toLowerCase();
				if (tweet.indexOf(this.track[i]) !== -1) {
					var parsedTweet = str.replace(/(this.track[i])/gi, '<span class="red">$1</span>');
					console.log(parsedTweet);
				}
			}

			return parsedTweet;
		}
	}
});