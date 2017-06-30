Vue.component('most-hated-user-tweets', {

	template: `
		<div id="most_hated_user_tweets" class="tweets" v-html="tweet">
		</div>
  `,

	data() {
		return {
			tweet: ''
		}
	},

	created: function() {

		// When we receive it, let's update the user
		socket.on('most_hated_user_tweet', function(tweet) {
			if (tweet) {
				this.updateTweet(tweet);
			}
		}.bind(this));

	},

	methods: {

		updateTweet: function(tweet) {
			this.tweet = lib.parseTweet(tweet, store.track);
		}
	}

});