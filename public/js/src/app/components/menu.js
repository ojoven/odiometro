Vue.component('menu-options', {

	template: `
		<ul id="menu">
			<li><a href="#" @click="setActive('Dashboard')" :class="{ active: showDashboard }" :aria-selected="[showDashboard]"><i class="fa fa-dashboard"></i><span class="srt">Dashboard</span></a></li>
			<li><a href="#" @click="setActive('User')" :class="{ active: showUser }" :aria-selected="[showUser]"><i class="fa fa-user"></i><span class="srt">Usuarios</span></a></li>
			<li><a href="#" @click="setActive('Historic')" :class="{ active: showHistoric }" :aria-selected="[showHistoric]"><i class="fa fa-bar-chart"></i><span class="srt">Histórico</span></a></li>
			<li><a href="#" @click="setActive('Info')" :class="{ active: showInfo }" :aria-selected="[showInfo]"><i class="fa fa-info"></i><span class="srt">Información</span></a></li>
			<li><a href="https://twitter.com/odiometrobot" target="_blank" rel="noopener noreferrer"><i class="fa fa-twitter"></i><span class="srt">Twitter @odiometrobot</span></a></li>
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