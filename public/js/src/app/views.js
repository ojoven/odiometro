Vue.component('views', {
	template: `
		<div id="views">

			<div id="dashboard" v-if="showDashboard">
				<number-tweets></number-tweets>
				<real-time-graph></real-time-graph>
				<tweet-show></tweet-show>
			</div>

			<div id="user" v-if="showUser">
				<most-hated-user></most-hated-user>
			</div>

		</div>
  `,
	data() {
		return {
			showDashboard: true,
			showUser: false
		}
	},
	created: function() {

	},
	methods: {
	}

});