Vue.component('most-hateful-user-tweets', {

	template: `
		<div id="most_hateful_user_tweets" class="tweets" v-html="tweet">
		</div>
  `,

	data() {
		return {
			tweet: ''
		}
	},

	created: function() {

		// When we receive it, let's update the user
		socket.on('most_hateful_user_tweet', function(data) {
			if (data) {
				this.updateTweet(data.tweet);
			}
		}.bind(this));

	},

	methods: {

		updateTweet: function(tweet) {
			this.tweet = lib.parseTweet(tweet, store.track);
		}
	}

});