Vue.component('views', {
	template: `
		<div id="views">

			<div id="dashboard-container" v-if="showDashboard">
				<number-tweets></number-tweets>
				<real-time-graph></real-time-graph>
				<tweet-show></tweet-show>
			</div>

			<div id="user-container" v-if="showUser">
				<most-hated-user></most-hated-user>
			</div>

			<div id="info-container" v-if="showInfo">
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
	},
	methods: {
	}

});