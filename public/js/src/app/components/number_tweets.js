Vue.component('number-tweets', {

	template: `
		<div id="number_tweets" class="number_tweets" role="status" aria-live="off">
			<span class="num">{{ number_tweets }}</span>
			<span class="suffix">{{$t('tweets_minute')}}</span>
		</div>
  `,

	data() {

		return {
			number_tweets: '',
			searching: false
		}
	},

	created: function () {

		// Let's ask immediately for the most hated user
		socket.emit('retrieve_number_tweets', true);

		// Update tweet socket
		socket.on('number_tweets', function (data) {
			this.updateNumberTweets(data);
		}.bind(this));
	},

	methods: {

		updateNumberTweets: function (data) {
			this.number_tweets = data.number_tweets;
		}
	}

});