Vue.component('tweet-show', {

	template: `
		<div id="tweets" class="tweets" v-html="tweet"></div>
  `,

	data() {
		return {
			tweet: ""
		}
	},

	created: function() {

		// Let's ask immediately for the last tweet
		socket.emit('retrieve_last_tweet', true);

		// Update tweet socket
		socket.on('tweet', function(tweet) {
			this.updateTweet(tweet);
		}.bind(this));

		// Retrieve the tracked queries (so we can highlight them in the tweets)
		axios.get('/track.json').then(function(response) {
			store.track = response.data;
		});
	},

	methods: {

		updateTweet: function(tweet) {
			this.tweet = lib.parseTweet(tweet, store.track);
		}
	}

});