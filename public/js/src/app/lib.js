/** LIBRARY **/
// We'll use this vue instance as the functions.js where we'll put some functions
// that are shared across the different components

const lib = new Vue({
	methods: {

		// Update View Parameters
		updateViewParameters: function(that, view) {

			that.showDashboard = that.showUser = that.showInfo = that.showHistoric =false;
			var variable = 'show' + view;
			that[variable] = true;
		},

		// Parse a Tweet (and auxiliars)
		parseTweet: function(tweet, track) {

			for (var i in track) {

				tweet = this.highlight(tweet, track[i]);
			}

			return tweet;
		},

		highlight: function(data, search) {
			return data.replace( new RegExp( "(" + this.preg_quote( search ) + ")" , 'gi' ), "<b>$1</b>" );
		},

		preg_quote: function(str) {
			return (str+'').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, "\\$1");
		},

		sortByFrequency: function(array) {
			var frequency = {};

			array.forEach(function(value) { frequency[value] = 0; });

			var uniques = array.filter(function(value) {
				return ++frequency[value] == 1;
			});

			return uniques.sort(function(a, b) {
				return frequency[b] - frequency[a];
			});
		}

	}
});