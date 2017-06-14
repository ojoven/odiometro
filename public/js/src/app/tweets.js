const app = new Vue({
	el:	'#tweets',
	data: {
		tweet: ""
	},
	created: function() {
		console.log('created');
		socket.on('tweet', function(tweet) {
			this.updateTweet(tweet);
		}.bind(this));
	},
	methods: {
		updateTweet: function(tweet) {
			this.tweet = tweet;
		}
	}
});