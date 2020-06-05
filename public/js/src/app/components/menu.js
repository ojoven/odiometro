Vue.component('menu-options', {

	template: `
	<nav aria-label="Menú">
		<ul id="menu">
			<li><a href="#" @click="setActive('Dashboard')" :class="{ active: showDashboard }" :aria-expanded="[showDashboard]" aria-controls="dashboard-container"><i class="fa fa-dashboard"></i><span class="srt">Dashboard</span></a></li>
			<li><a href="#" @click="setActive('User')" :class="{ active: showUser }" :aria-expanded="[showUser]" aria-controls="user-container"><i class="fa fa-user"></i><span class="srt">Usuarios</span></a></li>
			<li><a href="#" @click="setActive('Historic')" :class="{ active: showHistoric }" :aria-expanded="[showHistoric]" aria-controls="historic-container"><i class="fa fa-bar-chart"></i><span class="srt">Histórico</span></a></li>
			<li><a href="#" @click="setActive('Info')" :class="{ active: showInfo }" :aria-expanded="[showInfo]" aria-controls="info-container"><i class="fa fa-info"></i><span class="srt">Información</span></a></li>
			<li><a href="https://twitter.com/odiometrobot" target="_blank" rel="noopener noreferrer"><i class="fa fa-twitter"></i><span class="srt">Twitter @odiometrobot</span></a></li>
		</ul>
	</nav>
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