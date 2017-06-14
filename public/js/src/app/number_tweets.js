const numberTweets = new Vue({
	el:	'#number_tweets',
	data: {
		number_tweets: 0
	},
	created: function() {

		// Update tweet socket
		socket.on('number_tweets', function(data) {
			this.updateNumberTweets(data);
		}.bind(this));

	},
	methods: {
		updateNumberTweets: function(data) {
			//var parsedTweet = this.parseTweet(tweet);
			this.number_tweets = data.number_tweets;
		}
	}
});