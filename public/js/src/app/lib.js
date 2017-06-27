/** LIBRARY **/
// We'll use this vue instance as the functions.js where we'll put some functions
// that are shared across the different components

const lib = new Vue({
	methods: {

		updateViewParameters: function(that, view) {

			that.showDashboard = that.showUser = that.showInfo = false;
			var variable = 'show' + view;
			that[variable] = true;
		}

	}
});