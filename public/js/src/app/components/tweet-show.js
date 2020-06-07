Vue.component('tweet-show', {

	template: `
		<div id="tweets">
			<a target="_blank" class="tweet" :href="'https://twitter.com/' + screen_name + '/status/' + id_str">
				<span v-html="tweet"></span>
			</a>
		</div>
  `,

	data() {
		return {
			tweet: '',
			id_str: '',
			screen_name: '',
			words: [],
			lastStabWasLeft: false
		}
	},

	created: function () {

		// Let's ask immediately for the last tweet
		socket.emit('retrieve_last_tweet', true);

		// Update tweet socket
		socket.on('tweet', function (tweet) {
			this.updateTweet(tweet);
			this.updateHeaderStabs();
		}.bind(this));

	},

	methods: {

		updateTweet: function (tweet) {
			console.log(tweet.words);
			this.tweet = lib.parseTweet(tweet.tweet, tweet.words);
			this.id_str = tweet.id_str;
			this.screen_name = tweet.screen_name;
			this.words = tweet.words;
		},

		updateHeaderStabs: function () {

			var selector = this.lastStabWasLeft ? document.getElementById('stab-right') : document.getElementById('stab-left');
			selector.classList.add('active');
			this.lastStabWasLeft = !this.lastStabWasLeft;
			setTimeout(function () {
				selector.classList.remove('active');
			}, 510);
		}
	}

});