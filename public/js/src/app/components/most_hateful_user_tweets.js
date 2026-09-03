Vue.component('most-hateful-user-tweets', {

	template: `
		<div>
			<component :is="mockMode ? 'div' : 'a'" id="most_hateful_user_tweets" class="tweet"
				:target="mockMode ? null : '_blank'"
				:rel="mockMode ? null : 'noopener noreferrer'"
				:href="mockMode ? null : 'https://twitter.com/' + screen_name + '/status/' + tweet_id">
				<span v-html="tweet"></span>
			</component>
		</div>
  `,

	data() {
			return {
				tweet: '',
				screen_name: '',
				tweet_id: '',
				mockMode: store.mockMode
		}
	},

	created: function () {

		// When we receive it, let's update the user
		socket.on('most_hateful_user_tweet', function (data) {
			if (data) {
				this.updateTweet(data.tweet, data.words);
				this.updateLink(data.id_str, data.screen_name);
			}
		}.bind(this));

	},

	methods: {

		updateTweet: function (tweet, words) {
			this.tweet = lib.parseTweet(tweet, words);
		},

		updateLink: function (tweet_id, screen_name) {
			this.tweet_id = tweet_id;
			this.screen_name = screen_name;
		}
	}

});
