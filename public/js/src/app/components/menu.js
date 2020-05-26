Vue.component('menu-options', {

	template: `
		<ul id="menu">
			<li><a href="#" @click="setActive('Dashboard')" :class="{ active: showDashboard }"><i class="fa fa-dashboard"></i></a></li>
			<li><a href="#" @click="setActive('User')" :class="{ active: showUser }"><i class="fa fa-user"></i></a></li>
			<li><a href="#" @click="setActive('Historic')" :class="{ active: showHistoric }"><i class="fa fa-bar-chart"></i></a></li>
			<li><a href="#" @click="setActive('Info')" :class="{ active: showInfo }"><i class="fa fa-info"></i></a></li>
			<li><a href="https://twitter.com/odiometrobot" target="_blank" rel="noopener noreferrer"><i class="fa fa-twitter"></i></a></li>
		</ul>
  `,

	data() {

		return {
			showDashboard: store.showDashboard,
			showUser: store.showUser,
			showHistoric: store.showHistoric,
			showInfo: store.showInfo
		}
	},

	methods: {

		setActive: function (view) {
			lib.updateViewParameters(this, view);
			bus.$emit('change-view', view);
		}
	}

});