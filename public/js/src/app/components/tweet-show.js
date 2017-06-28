Vue.component('tweet-show', {
	template: `
		<div id="tweets" class="tweets" v-html="tweet"></div>
  `,
	data() {
		return {
			tweet: "",
			track: []
		}
	},
	created: function() {

		// Let's ask immediately for the last tweet
		socket.emit('retrieve_last_tweet', true);

		// Update tweet socket
		socket.on('tweet', function(tweet) {
			console.log('WAW');
			this.updateTweet(tweet);
		}.bind(this));

		// Retrieve the tracked queries (so we can highlight them in the tweets)
		var that = this;
		axios.get('/track.json')
			.then(function (response) {
				that.track = response.data;
			});
	},
	methods: {
		updateTweet: function(tweet) {
			var parsedTweet = this.parseTweet(tweet);
			this.tweet = parsedTweet;
		},
		parseTweet: function(tweet) {

			for (var i in this.track) {

				tweet = this.highlight(tweet, this.track[i]);
			}

			return tweet;
		},
		highlight: function(data, search) {
			return data.replace( new RegExp( "(" + this.preg_quote( search ) + ")" , 'gi' ), "<b>$1</b>" );
		},
		preg_quote: function(str) {
			return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
		}
	}

});