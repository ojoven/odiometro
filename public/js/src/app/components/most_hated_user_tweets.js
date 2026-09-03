Vue.component('most-hated-user-tweets', {

	template: `
		<div>
			<component v-for="tweet in tweets" :key="tweet.id_str" :is="mockMode ? 'div' : 'a'"
				class="tweet" :target="mockMode ? null : '_blank'"
				:rel="mockMode ? null : 'noopener noreferrer'"
				:href="mockMode ? null : 'https://twitter.com/' + tweet.screen_name + '/status/' + tweet.id_str">
				<span v-html="tweet.text"></span>
			</component>
		</div>
  `,

	data() {
		return {
			tweets: [],
			screen_name: '',
			tweet_id: '',
			mockMode: store.mockMode
		}
	},

	created: function () {

		// When we receive it, let's update the user
		socket.on('most_hated_user_tweets', function (tweets) {
			if (tweets) {
				var tweetsParsed = [];
				tweets.forEach(function (tweet) {
					var tweetParsed = tweet;
					tweetParsed.text = lib.parseTweet(tweet.text, tweet.words.split(','));
					tweetsParsed.push(tweetParsed);
				});
				this.updateTweets(tweetsParsed);
			}
		}.bind(this));

	},

	methods: {

		updateTweets: function (tweets) {
			this.tweets = tweets;
		},

	}

});
