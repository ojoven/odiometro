Vue.component('most-hated-user-tweets', {

	template: `
		<div>
			<div id="most_hated_user_tweets" class="tweets" v-html="tweet">
			</div>
			<a class="btn" target="_blank" :href="'https://twitter.com/' + screen_name + '/status/' + tweet_id">ver tuit</a>
		</div>
  `,

	data() {
		return {
			tweet: '',
			screen_name: '',
			tweet_id: ''
		}
	},

	created: function() {

		// When we receive it, let's update the user
		socket.on('most_hated_user_tweet', function(data) {
			if (data) {
				this.updateTweet(data.tweet);
				this.updateLink(data.id_str, data.screen_name);
			}
		}.bind(this));

	},

	methods: {

		updateTweet: function(tweet) {
			this.tweet = lib.parseTweet(tweet, store.track);
		},

		updateLink: function(tweet_id, screen_name) {
			this.tweet_id = tweet_id;
			this.screen_name = screen_name;
		}
	}

});