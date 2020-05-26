Vue.component('views', {

	template: `
		<div id="views">

			<div id="dashboard-container" v-show="showDashboard" class="view" :aria-hidden="[!showDashboard]">
				<number-tweets></number-tweets>
				<real-time-graph></real-time-graph>
				<tweet-show></tweet-show>
			</div>

			<div id="user-container" v-show="showUser" class="view" :aria-hidden="[!showUser]">

				<div class="hate-user hateful-user">
					<most-hateful-user-image></most-hateful-user-image>
					<most-hateful-user></most-hateful-user>
					<most-hateful-user-tweets></most-hateful-user-tweets>
				</div>

				<div class="hate-user hated-user">
					<most-hated-user-image></most-hated-user-image>
					<most-hated-user></most-hated-user>
					<most-hated-user-tweets></most-hated-user-tweets>
				</div>

			</div>

			<div id="historic-container" v-show="showHistoric" class="view" :aria-hidden="[!showHistoric]">
				<historic></historic>
			</div>

			<div id="info-container" v-show="showInfo" class="view" :aria-hidden="[!showInfo]">
				<info></info>
			</div>

		</div>
  `,

	data() {
		return {
			showDashboard: store.showDashboard,
			showUser: store.showUser,
			showHistoric: store.showHistoric,
			showInfo: store.showInfo
		}
	},

	created: function () {

		var that = this;
		bus.$on('change-view', function (view) {
			lib.updateViewParameters(that, view);
		});
	}

});