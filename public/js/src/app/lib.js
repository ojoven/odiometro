/** LIBRARY **/
// We'll use this vue instance as the functions.js where we'll put some functions
// that are shared across the different components

const lib = new Vue({
	methods: {

		// Update View Parameters
		updateViewParameters: function (that, view) {

			that.showDashboard = that.showUser = that.showInfo = that.showHistoric = false;
			var variable = 'show' + view;
			that[variable] = true;
		},

		// Parse a Tweet (and auxiliars)
		parseTweet: function (tweet, track) {

			tweet = this.parseTweetUsers(tweet);

			for (var i in track) {
				tweet = this.highlight(tweet, track[i]);
			}

			return tweet;
		},

		highlight: function (data, search) {
			if (!data) return false;
			return data.replace(new RegExp("(" + this.preg_quote(search) + ")", 'gi'), "<b>$1</b>");
		},

		preg_quote: function (str) {
			return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
		},

		parseTweetUsers: function (tweet) {

			var users = tweet.match(/@\w+/g);
			if (!users) return tweet;

			users.forEach(function (user) {
				tweet = tweet.replace(user, '<span class="user">' + user + '</span>');
			});

			return tweet;
		},

	}
});