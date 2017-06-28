Vue.component('views', {

	template: `
		<div id="views">

			<div id="dashboard-container" v-show="showDashboard">
				<number-tweets></number-tweets>
				<real-time-graph></real-time-graph>
				<tweet-show></tweet-show>
			</div>

			<div id="user-container" v-show="showUser">
				<most-hated-user></most-hated-user>
				<most-hated-user-tweets></most-hated-user-tweets>
			</div>

			<div id="info-container" v-show="showInfo">
				<info></info>
			</div>

		</div>
  `,

	data() {
		return {
			showDashboard: store.showDashboard,
			showUser: store.showUser,
			showInfo: store.showInfo
		}
	},

	created: function() {
		console.log('views: ' + this.showDashboard);

		var that = this;
		bus.$on('change-view', function(view) {
			lib.updateViewParameters(that, view);
		});
	}

});