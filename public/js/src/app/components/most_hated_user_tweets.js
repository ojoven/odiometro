Vue.component('most-hated-user-tweets', {

	template: `
		<div>
			<a v-for="tweet in tweets" id="most_hated_user_tweets" class="tweet" target="_blank" :href="'https://twitter.com/' + tweet.screen_name + '/status/' + tweet.id_str">
				<span v-html="tweet.text"></span>
			</a>
		</div>
  `,

	data() {
		return {
			tweets: [],
			screen_name: '',
			tweet_id: ''
		}
	},

	created: function () {

		// When we receive it, let's update the user
		socket.on('most_hated_user_tweets', function (tweets) {
			console.log('most hated', tweets);
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